from typing import List, Dict, Optional, Set
from datetime import datetime
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, Process, LLM
import json
from litellm import completion
import os
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
from duckduckgo_search import DDGS
import sqlite3
from pathlib import Path
from enum import Enum
from ast import literal_eval

os.environ['LITELLM_LOG'] = 'DEBUG'
# Load environment variables
load_dotenv()

llm = LLM(model="groq/gemma2-9b-it")


# Core Data Models
class Department(Enum):
    POLICE = "police"
    FIRE = "fire"
    MEDICAL = "medical"
    MENTAL_HEALTH = "mental_health"
    DISASTER_RESPONSE = "disaster_response"
    CYBER_SECURITY = "cyber_security"


class CallerDetails(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    emergency_type: Optional[str] = None
    urgency_level: int = Field(ge=1, le=5)
    key_details: List[str]


class LocationInfo(BaseModel):
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_context: Optional[str] = None
    confidence: float = 0.0
    source: str = "conversation"  # Can be "conversation", "simulator", or "geocoded"


class DepartmentRoutingInfo(BaseModel):
    primary_department: Department
    secondary_departments: List[Department] = []
    routing_confidence: float
    urgency_level: int = Field(ge=1, le=5)
    dispatch_notes: str
    required_resources: List[str]


class CallAnalysis(BaseModel):
    conversation_id: str
    timestamp: datetime
    summary: str
    spam_probability: float
    urgency_level: int = Field(ge=1, le=5)
    caller_details: CallerDetails
    location_info: Optional[LocationInfo] = None
    relevant_news: List[Dict[str, str]] = []
    department_routing: DepartmentRoutingInfo
    raw_transcript: str


class SummaryOutput(BaseModel):
    summary: str
    key_points: List[str]
    critical_info: Optional[str] = None


class UrgencyOutput(BaseModel):
    level: int = Field(ge=1, le=5)
    relative_score: float = Field(ge=0.0, le=1.0)  # Normalized relative urgency score (0.0-1.0)
    justification: str
    immediate_actions: List[str]
    time_sensitivity: str = "medium"  # Can be "low", "medium", "high", or "critical"


class DepartmentOutput(BaseModel):
    primary_department: Department
    secondary_departments: List[Department]
    confidence: float
    notes: str
    required_resources: List[str]


class InfoExtractionOutput(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    emergency_type: Optional[str] = None
    key_details: List[str]


class LocationOutput(BaseModel):
    location: Optional[str] = None
    landmarks: List[str] = []
    area_type: Optional[str] = None
    additional_context: Optional[str] = None


class NewsOutput(BaseModel):
    news: List[Dict[str, str]]
    relevance_scores: List[float]


class SpamOutput(BaseModel):
    probability: float
    indicators: List[str]
    confidence: float
    
class Output(BaseModel):
    summary: str
    key_points: List[str]
    critical_info: Optional[str] = None
    level: int = Field(ge=1, le=5)
    relative_score: float = Field(ge=0.0, le=1.0)  # Normalized relative urgency score (0.0-1.0)
    time_sensitivity: str = "medium"  # Can be "low", "medium", "high", or "critical"
    justification: str
    immediate_actions: List[str]
    primary_department: Department
    secondary_departments: List[Department]
    confidence: float
    notes: str
    required_resources: List[str]
    name: Optional[str] = None
    phone: Optional[str] = None
    emergency_type: Optional[str] = None
    key_details: List[str]
    location: Optional[str] = None
    landmarks: List[str] = []
    area_type: Optional[str] = None
    additional_context: Optional[str] = None
    news: List[Dict[str, str]]
    news_timestamp: Optional[str] = None  # When the news was published
    relevance_scores: List[float]
    probability: float
    indicators: List[str]
    spam_confidence: float


class CoreCallAnalysisAgents:
    def __init__(self):
        self.setup_agents()
        self.geolocator = Nominatim(user_agent="emergency_call_system")
        
    def setup_agents(self):
        self.agents = {
            'summarizer': Agent(
                role='Call Summarizer',
                goal='Create concise summaries of emergency calls',
                backstory='Expert at extracting key information from emergency conversations',
                llm=llm,
                verbose=True
            ),
            'urgency_assessor': Agent(
                role='Urgency Level Assessor',
                goal='Evaluate emergency priority and urgency level',
                backstory='Emergency response coordinator with triage experience',
                llm=llm,
                verbose=True
            ),
            'department_router': Agent(
                role='Department Router',
                goal='Determine appropriate emergency response departments',
                backstory='Expert in emergency response coordination',
                llm=llm,
                verbose=True
            ),
            'info_extractor': Agent(
                role='Information Extraction Specialist',
                goal='Extract critical details from emergency calls',
                backstory='Specialist in identifying key emergency information',
                llm=llm,
                verbose=True
            ),
            'location_analyzer': Agent(
                role='Location Analysis Specialist',
                goal='Extract and validate location information',
                backstory='Expert in geographical information and location analysis',
                llm=llm,
                verbose=True
            ),
            'news_finder': Agent(
                role='Local News Analyzer',
                goal='Find relevant local news and incidents',
                backstory='Specialist in local news and emergency incident correlation',
                llm=llm,
                verbose=True
            ),
            'spam_detector': Agent(
                role='Spam Detection Specialist',
                goal='Identify potential spam or false emergency calls',
                backstory='Expert in detecting fraudulent emergency calls',
                llm=llm,
                verbose=True
            )
        }

    def create_tasks(self, conversation_text: str) -> List[Task]:
        return [
            Task(
                description=f"""Create a concise summary of this emergency call:
                {conversation_text}
                
                Provide output in the following JSON format:
                {{
                    "summary": "Brief summary of the call",
                    "key_points": ["key point 1", "key point 2"],
                    "critical_info": "Any critical information"
                }}""",
                agent=self.agents['summarizer'],
                expected_output="JSON containing summary, key points, and critical information",
                task_name="summarize"
            ),
            Task(
                description=f"""Assess the urgency level of this emergency:
                {conversation_text}
                
                Provide output in the following JSON format:
                {{
                    "level": 3,  # Integer from 1-5, where 5 is most urgent
                    "relative_score": 0.75,  # Float from 0.0-1.0 indicating relative urgency compared to other emergencies
                    "time_sensitivity": "high",  # String: "low", "medium", "high", or "critical"
                    "justification": "Explanation of urgency level and why this emergency has this relative priority",
                    "immediate_actions": ["action 1", "action 2"]
                }}""" + """
                
                Guidelines for urgency assessment:
                - Level 1 (relative_score 0.0-0.2): Non-emergency situations, general inquiries, minor concerns
                - Level 2 (relative_score 0.2-0.4): Situations requiring attention but not immediately life-threatening
                - Level 3 (relative_score 0.4-0.6): Urgent situations that need prompt response but with no immediate danger
                - Level 4 (relative_score 0.6-0.8): Serious emergencies with potential for harm if not addressed quickly
                - Level 5 (relative_score 0.8-1.0): Critical life-threatening emergencies requiring immediate response
                
                Time sensitivity refers to how quickly the situation could deteriorate:
                - "low": Stable situation unlikely to worsen in the next several hours
                - "medium": Situation could worsen within hours if not addressed
                - "high": Situation likely to worsen within an hour if not addressed
                - "critical": Immediate response needed to prevent loss of life/severe consequences
                """,
                agent=self.agents['urgency_assessor'],
                expected_output="JSON containing urgency level, relative score, time sensitivity, justification, and immediate actions",
                task_name="assess_urgency"
            ),
            Task(
                description=f"""Determine appropriate emergency departments:
                {conversation_text}
                
                Provide output in the following JSON format:
                {{
                    "primary_department": "POLICE",
                    "secondary_departments": ["MEDICAL", "FIRE"],
                    "confidence": 0.95,
                    "notes": "Dispatch notes",
                    "required_resources": ["resource1", "resource2"]
                }}""",
                agent=self.agents['department_router'],
                expected_output="JSON containing department routing information and required resources",
                task_name="route_department"
            ),
            Task(
                description=f"""Extract critical information from this call:
                {conversation_text}
                
                Provide output in the following JSON format:
                {{
                    "name": "Caller's name if available",
                    "phone": "Phone number if available",
                    "emergency_type": "Type of emergency",
                    "key_details": ["detail 1", "detail 2"]
                }}""",
                agent=self.agents['info_extractor'],
                expected_output="JSON containing extracted caller and emergency information",
                task_name="extract_info"
            ),
            Task(
                description=f"""Extract and validate detailed location information from this emergency call:
                {conversation_text}
                
                Focus on extracting the following:
                1. Specific address or location mentioned by the caller
                2. City, state, district, or other geographic identifiers
                3. Nearby landmarks or reference points
                4. Any directional information (north, south, near the bridge, etc.)
                5. Building types, floor numbers, or apartment identifiers
                
                Provide output in the following JSON format:
                {{
                    "location": "Full location description as mentioned by caller",
                    "extracted_locations": ["Chennai", "Park Street", "Near Central Hospital"],
                    "primary_location": "Most specific location identified",
                    "landmarks": ["landmark 1", "landmark 2"],
                    "area_type": "residential/commercial/industrial/rural/etc",
                    "confidence": 0.85,
                    "additional_context": "Any additional location context or notes about the location"
                }}""",
                agent=self.agents['location_analyzer'],
                expected_output="JSON containing detailed location extraction, confidence score, and context",
                task_name="analyze_location"
            ),
            Task(
                description=f"""Find relevant local news and incidents in the area related to this emergency:
                {conversation_text}
                
                Focus on extracting the location and emergency type first, then search for recent news (last 24 hours if possible).
                
                Provide output in the following JSON format:
                {{
                    "news": [
                        {{"title": "News title", "link": "URL", "published": "publication date if available"}},
                        {{"title": "News title", "link": "URL", "published": "publication date if available"}}
                    ],
                    "relevance_scores": [0.9, 0.8],
                    "timestamp": "Time when the search was performed"
                }}""",
                agent=self.agents['news_finder'],
                expected_output="JSON containing relevant recent news articles with timestamps and relevance scores",
                task_name="find_news"
            ),
            Task(
                description=f"""Analyze this call for potential spam indicators in which it could be a spam call to the dispatcher.
                keep in mind that a person is calling at a scene of emergency. so the data might be vague because the person is in panic:
                {conversation_text}
                
                Provide output in the following JSON format:
                {{
                    "probability": 0.1,
                    "indicators": ["indicator1", "indicator2"],
                    "spam_confidence": 0.95
                }}""",
                agent=self.agents['spam_detector'],
                expected_output="JSON containing spam analysis results and spam confidence score",
                task_name="check_spam"
            ),
            Task(
                description=f"""Create a final comprehensive report of all findings:
                {conversation_text}
                
                Review the outputs of all previous tasks and create a final summary report that includes:
                - Name of the caller :
                - Summary of the situation
                - Location details
                - Relevant news articles
                - Department routing information
                - Urgency level assessment
                - Spam probability
                
                
                For any None value or missing information, provide an empty string.
               """,
                agent=self.agents['summarizer'],  # Using the summarizer agent for the final report
                expected_output="""
                    JSON containing a comprehensive report with the following fields:
                    {
                        "name": "Caller's name if available",
                        "phone": "Phone number if available",
                        "summary": "Summary of the situation",
                        "key_points": ["key point 1", "key point 2"],
                        "critical_info": "Any critical information",
                        "level": 3,
                        "justification": "Explanation of urgency level",
                        "immediate_actions": ["action 1", "action 2"],
                        "primary_department": "POLICE",
                        "secondary_departments": ["MEDICAL", "FIRE"],
                        "confidence": 0.95,
                        "notes": "Dispatch notes",
                        "required_resources": ["resource1", "resource2"],
                        "emergency_type": "Type of emergency",
                        "key_details": ["detail 1", "detail 2"],
                        "location": "Full location description",
                        "landmarks": ["landmark 1", "landmark 2"],
                        "area_type": "residential/commercial/etc",
                        "additional_context": "Any additional location context",
                        "news": [
                            {"title": "News title", "link": "URL"},
                            {"title": "News title", "link": "URL"}
                        ],
                        "relevance_scores": [0.9, 0.8],
                        "probability": 0.1,
                        "indicators": ["indicator1", "indicator2"],
                        "spam_confidence": 0.95
                """,
                task_name="final_report"
            ),
        ]

    def enhance_location_data(self, results_dict: Dict, conversation_text: str, simulator_data: Optional[Dict] = None):
        """Enhance location data using multiple sources"""
        try:
            # Get location from conversation analysis results
            conversation_location = {}
            if "location" in results_dict:
                conversation_location = {
                    "address": results_dict.get("location"),
                    "confidence": results_dict.get("confidence", 0.5),
                    "source": "conversation_analysis"
                }
            
            # Extract additional location details directly from text
            extracted_location = self.extract_location_details(conversation_text)
            
            # Get location from simulator data if available
            simulator_location = None
            if simulator_data and "location" in simulator_data:
                simulator_location = {
                    "address": simulator_data["location"],
                    "confidence": 0.95,  # High confidence for simulator data
                    "source": "simulator"
                }
                
                # If simulator has coordinates
                if "coordinates" in simulator_data:
                    simulator_location["latitude"] = simulator_data["coordinates"].get("latitude")
                    simulator_location["longitude"] = simulator_data["coordinates"].get("longitude")
            
            # Prioritize location data sources (simulator > extracted > conversation analysis)
            if simulator_location and simulator_location.get("address"):
                best_location = simulator_location
            elif extracted_location and extracted_location.get("primary_location"):
                best_location = extracted_location
            elif conversation_location and conversation_location.get("address"):
                best_location = conversation_location
            else:
                best_location = None
            
            # Update results with enhanced location data
            if best_location:
                # Save original location for reference
                if "location" in results_dict:
                    results_dict["original_location"] = results_dict["location"]
                    
                # Update with best location
                results_dict["location"] = best_location.get("address") or best_location.get("primary_location")
                results_dict["location_confidence"] = best_location.get("confidence", 0.0)
                results_dict["location_source"] = best_location.get("source", "unknown")
                
                # Add extracted locations if available
                if "extracted_locations" in extracted_location:
                    results_dict["extracted_locations"] = extracted_location["extracted_locations"]
                
                # Add coordinates if available
                if not "coordinates" in results_dict:
                    results_dict["coordinates"] = {}
                    
                if "latitude" in best_location and "longitude" in best_location:
                    results_dict["coordinates"]["latitude"] = best_location["latitude"]
                    results_dict["coordinates"]["longitude"] = best_location["longitude"]
        
        except Exception as e:
            print(f"Error enhancing location data: {str(e)}")

    def analyze_conversation(self, conversation_file: str, simulator_data: Optional[Dict] = None):
        """Analyze conversation with optional simulator data for enhanced location extraction"""
        try:
            conversation_text = self.read_conversation(conversation_file)
            
            # Create tasks separately so we can reference them
            tasks = self.create_tasks(conversation_text)
            
            crew = Crew(
                agents=list(self.agents.values()),
                tasks=tasks,
                process=Process.sequential,
                verbose=True
            )
            
            # Add defensive error handling
            try:
                results = crew.kickoff()
                # Make sure we have a valid response before parsing
                if not results or not hasattr(results, 'raw') or not results.raw:
                    print(f"Warning: Empty or invalid results from crew.kickoff()")
                    # Provide fallback response structure
                    return self.create_fallback_response(conversation_text)
                    
                results_dict = json.loads(results.raw)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from agent response: {e}")
                print(f"Problematic response: {results if 'results' in locals() else 'No results'}")
                # Return a minimal valid response
                return self.create_fallback_response(conversation_text)
            
            # Post-process results to enhance location data
            self.enhance_location_data(results_dict, conversation_text, simulator_data)
            
            return results_dict
                
        except KeyError as e:
            print(f"Missing required field in agent response: {e}")
            print(f"Available fields: {results_dict if 'results_dict' in locals() else 'No results available'}")
            # Return minimal valid response instead of raising
            return self.create_fallback_response(conversation_text)
        except Exception as e:
            print(f"Error processing results: {e}")
            # Return minimal valid response instead of raising
            return self.create_fallback_response(conversation_text)
            # No need to raise exception, we'll return fallback response instead
            return self.create_fallback_response(conversation_text)
            
    def create_fallback_response(self, conversation_text: str) -> Dict:
        """Create a fallback response with minimal valid structure when analysis fails"""
        print("Creating fallback response for failed analysis")
        
        # Extract basic info we can determine without LLM
        call_id = "unknown"
        try:
            # Try to extract call ID from conversation if present
            if "Conversation ID:" in conversation_text:
                call_id_line = conversation_text.split("Conversation ID:")[1].strip().split("\n")[0].strip()
                if call_id_line:
                    call_id = call_id_line
        except Exception as e:
            print(f"Error extracting call ID from fallback: {str(e)}")
            
        # Extract location with simple pattern matching
        location = "Unknown"
        try:
            location_details = self.extract_location_details(conversation_text)
            if location_details and "primary_location" in location_details:
                location = location_details["primary_location"]
        except Exception as e:
            print(f"Error extracting location in fallback: {str(e)}")
        
        # Create minimal valid response structure that won't break database storage
        return {
            "call_id": call_id,
            "name": "Unknown",
            "location": location,
            "location_confidence": 0.3,
            "location_source": "fallback_extraction",
            "emergency_type": "Unknown",
            "level": 3,  # Default medium urgency when we can't determine
            "relative_score": 0.5,
            "time_sensitivity": "medium",
            "primary_department": "DISASTER_RESPONSE",  # Safe default
            "summary": "Analysis failed - emergency details could not be extracted."
        }

    def read_conversation(self, filename: str) -> str:
        with open(filename, 'r') as file:
            return file.read()
            
    def extract_location_details(self, text: str) -> Dict:
        """Extract location information from conversation text using pattern matching."""
        import re
        
        # First look for explicit location mentions
        location_patterns = [
            # Match "in [location]" pattern
            r'(?:in|at|near|from) ([\w\s,\-\.]+)',
            # Match "my location is [location]" pattern
            r'(?:my|current|the)\s+location\s+(?:is|:)\s+([\w\s,\-\.]+)',
            # Match addresses with common indicators
            r'(?:address|street|road|avenue|building)\s+(?:is|:)?\s+([\w\s,\-\.]+)'
        ]
        
        extracted_locations = []
        for pattern in location_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                for match in matches:
                    # Clean up the location string
                    location = match.strip().rstrip('.,:;')
                    if location and len(location) > 2:  # Minimum reasonable length
                        extracted_locations.append(location)
        
        # If we found locations, attempt to geocode the most specific one
        result = {
            "extracted_locations": extracted_locations,
            "confidence": 0.0,
            "source": "conversation"
        }
        
        if extracted_locations:
            print(f"Extracted locations: {extracted_locations}")
            # Try geocoding each location in order of specificity (assume longer names are more specific)
            sorted_locations = sorted(extracted_locations, key=len, reverse=True)
            result["primary_location"] = sorted_locations[0]
            result["confidence"] = 0.7
            
            # Attempt to geocode
            location_info = self.geocode_location(sorted_locations[0])
            if location_info:
                result.update(location_info)
                result["confidence"] = 0.9
        
        return result
    
    def extract_call_simulator_data(self, call_id: str) -> Optional[Dict]:
        """Extract simulator data from call metadata if available"""
        try:
            # Check for simulator metadata file (this would be created by the call simulator)
            metadata_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                                        "call_simulator", "metadata", f"{call_id}.json")
            
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error extracting simulator data: {str(e)}")
        
        return None
    
    def geocode_location(self, location_string: str) -> Optional[Dict]:
        """Geocode a location string to obtain coordinates"""
        try:
            geolocator = Nominatim(user_agent="emergency_call_processor")
            location = geolocator.geocode(location_string)
            
            if location:
                print(f"Successfully geocoded: {location_string}")
                return {
                    "address": location.address,
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "area_type": self.estimate_area_type(location.address),
                    "source": "geocoded"
                }
        except GeocoderTimedOut:
            print(f"Geocoding service timed out for: {location_string}")
        except Exception as e:
            print(f"Error in geocoding: {str(e)}")
            
        return None
        
    def estimate_area_type(self, address: str) -> str:
        """Estimate area type based on address keywords"""
        address_lower = address.lower()
        
        if any(keyword in address_lower for keyword in ['apartment', 'flat', 'residential', 'housing']):
            return "residential"
        elif any(keyword in address_lower for keyword in ['office', 'business', 'mall', 'shop', 'store', 'commercial']):
            return "commercial"
        elif any(keyword in address_lower for keyword in ['factory', 'plant', 'warehouse', 'industrial']):
            return "industrial"
        elif any(keyword in address_lower for keyword in ['farm', 'village', 'countryside', 'rural']):
            return "rural"
        elif any(keyword in address_lower for keyword in ['hospital', 'clinic', 'medical']):
            return "medical"
        elif any(keyword in address_lower for keyword in ['school', 'university', 'college', 'campus']):
            return "educational"
        
        return "unknown"

    def get_location_info(self, location_str: str) -> LocationInfo:
        try:
            location = self.geolocator.geocode(location_str)
            if location:
                return LocationInfo(
                    address=location.address,
                    latitude=location.latitude,
                    longitude=location.longitude,
                    area_context=self.get_area_context(location.latitude, location.longitude)
                )
        except GeocoderTimedOut:
            print("Geocoding service timed out")
        return LocationInfo()

    def get_area_context(self, lat: float, lon: float) -> str:
        # Implement area context gathering logic
        return "Area context would be fetched here"

    def search_local_news(self, location: str, emergency_type: str, time_period: str = "d") -> List[Dict[str, str]]:
        """
        Search for local news related to an emergency in a specific location.
        
        Args:
            location: The location to search for news
            emergency_type: The type of emergency (fire, flood, etc.)
            time_period: Time period for news search: 'd' (day), 'w' (week), 'm' (month)
        
        Returns:
            List of news article dictionaries with title, link, and publication date
        """
        search_query = f"{emergency_type} {location} news"
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        try:
            with DDGS() as ddgs:
                # Set time_period to filter by recency
                results = list(ddgs.news(search_query, max_results=5, time_period=time_period))
                
                # Create more comprehensive news items
                news_items = []
                for r in results:
                    news_item = {
                        "title": r["title"],
                        "link": r["link"],
                        "published": r.get("published", "Unknown")
                    }
                    news_items.append(news_item)
                
                # Add timestamp for when the search was performed
                return {"news": news_items, "timestamp": current_time}
        except Exception as e:
            print(f"Error during news search: {e}")
            return {"news": [], "timestamp": current_time}


def main():
    agents = CoreCallAnalysisAgents()
    analysis = agents.analyze_conversation("conversations/2381be27-43e3-4f89-9a04-64f3f0a627f7")
    # Since analyze_conversation returns a dict, we don't need model_dump()
    print(json.dumps(analysis, indent=2, default=str))

if __name__ == "__main__":
    main()
