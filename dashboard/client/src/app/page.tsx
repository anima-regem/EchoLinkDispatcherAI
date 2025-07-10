"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users, Phone, AlertCircle, CheckCircle2, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const timer = setTimeout(() => setStatsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const stats = [
        { number: "82%", label: "Call Centers Understaffed", icon: AlertCircle },
        { number: "4.2M", label: "Emergency Calls Daily", icon: Phone },
        { number: "45s", label: "Average Wait Time", icon: Zap },
        { number: "24/7", label: "AI Coverage", icon: Shield }
    ];

    const features = [
        {
            icon: Zap,
            title: "Instant Triage",
            description: "AI-powered initial assessment reduces response time by 60%"
        },
        {
            icon: Users,
            title: "Human Oversight",
            description: "Expert dispatchers maintain control with AI assistance"
        },
        {
            icon: Globe,
            title: "Real-time Intelligence",
            description: "Location tracking and emergency correlation for faster response"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Modern Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 z-50 w-full backdrop-blur-lg bg-slate-950/80 border-b border-slate-800/50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.div 
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Shield className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-slate-100">DispatcherAI</span>
                    </motion.div>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-300 hover:text-slate-100 transition-colors font-medium">Features</a>
                        <a href="#stats" className="text-slate-300 hover:text-slate-100 transition-colors font-medium">Impact</a>
                        <a href="#demo" className="text-slate-300 hover:text-slate-100 transition-colors font-medium">Demo</a>
                    </div>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/live">
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 px-6 py-2 font-semibold shadow-lg">
                                Try Live Demo
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section 
                className="pt-32 pb-20 px-6"
                variants={containerVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-8"
                    >
                        <Zap className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-blue-300 text-sm font-medium">Eliminating 911 Wait Times</span>
                    </motion.div>
                    
                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                        The Future of
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                            Emergency Response
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        variants={itemVariants}
                        className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        AI-powered emergency dispatch system that reduces response times by 60% 
                        while maintaining human oversight for critical decisions.
                    </motion.p>
                    
                    <motion.div 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/live">
                            <motion.div
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold">
                                    Launch Live Demo
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        </Link>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Button variant="outline" size="lg" className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 px-8 py-4 text-lg">
                                Watch Demo
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section 
                id="stats"
                className="py-20 px-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    whileHover={{ 
                                        scale: 1.05,
                                        rotateY: 5,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center group"
                                >
                                    <motion.div
                                        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                        {stat.number}
                                    </h3>
                                    <p className="text-slate-300 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section 
                id="features"
                className="py-20 px-6 bg-black/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-white mb-4">
                            Revolutionary
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Features</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Cutting-edge AI technology designed to save lives and optimize emergency response
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.3 }}
                                    viewport={{ once: true }}
                                    whileHover={{ 
                                        y: -10,
                                        transition: { type: "spring", stiffness: 300 }
                                    }}
                                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group hover:border-blue-400/50 transition-all duration-300"
                                >
                                    <motion.div
                                        className="w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <IconComponent className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                id="demo"
                className="py-20 px-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/20"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h2 className="text-5xl font-bold text-white mb-6">
                            Ready to Transform
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                                Emergency Response?
                            </span>
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Experience the future of emergency dispatch with our live demo. 
                            See how AI can save lives while keeping humans in control.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/live">
                                <motion.div
                                    whileHover={{ 
                                        scale: 1.05, 
                                        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
                                        background: "linear-gradient(45deg, #3b82f6, #06b6d4)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="inline-block"
                                >
                                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 px-12 py-4 text-lg font-semibold rounded-full">
                                        <Zap className="w-5 h-5 mr-2" />
                                        Launch Live Demo
                                    </Button>
                                </motion.div>
                            </Link>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Button variant="outline" size="lg" className="border-blue-400/50 text-blue-300 hover:bg-blue-500/20 px-12 py-4 text-lg rounded-full">
                                    <Users className="w-5 h-5 mr-2" />
                                    Contact Sales
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer 
                className="py-12 px-6 border-t border-white/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">DispatcherAI</span>
                    </div>
                    <p className="text-slate-400">
                        © 2024 DispatcherAI. Revolutionizing emergency response with AI.
                    </p>
                </div>
            </motion.footer>
        </div>
    );
}
