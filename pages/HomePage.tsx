import React from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { LightningIcon } from '../components/icons/LightningIcon';
import { ChartIcon } from '../components/icons/ChartIcon';
import { ShieldIcon } from '../components/icons/ShieldIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ArrowUpIcon } from '../components/icons/ArrowUpIcon';
import { BrainIcon } from '../components/icons/BrainIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { VideoIcon } from '../components/icons/VideoIcon';

const HomePage: React.FC = () => {

  return (
    <div className="bg-light-bg dark:bg-dark-bg font-sans">
      
      {/* Hero Section - Dark & Vibrant */}
      <section className="relative bg-midnight text-white pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
         {/* Abstract Background Shapes */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-semibold tracking-wide text-secondary-light">
                ✨ New: Short-Form Video Analysis Added
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight tracking-tight">
                Marketing Magic.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Zero Friction.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
                Audit Articles, Video Scripts, SEO, and Viral Potential from just one platform. 
                The all-in-one toolkit for modern creators.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <div className="relative w-full max-w-md">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full px-6 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/50 shadow-lg"
                    />
                    <div className="hidden sm:block absolute right-1.5 top-1.5">
                         <NavLink to="/register">
                            <Button size="sm">Get Started</Button>
                         </NavLink>
                    </div>
                 </div>
                 <div className="sm:hidden w-full max-w-md">
                     <NavLink to="/register">
                        <Button className="w-full">Get Started Free</Button>
                     </NavLink>
                 </div>
            </div>

            <div className="mt-6 text-sm text-gray-400">
                No credit card required • Free plan available
            </div>
         </div>

         {/* Dashboard Preview Visual (GIF Container) */}
         <div className="mt-16 mx-auto max-w-5xl px-4">
             <div className="rounded-xl bg-white/5 backdrop-blur-sm p-2 border border-white/10 shadow-2xl">
                 <div className="rounded-lg overflow-hidden bg-midnight-lighter aspect-[16/9] relative flex items-center justify-center border border-white/5 group">
                    {/* 
                        INSTRUCTIONS FOR USER: 
                        1. Name your file "dashboard-demo.gif"
                        2. Put it in the "public" folder of your project.
                    */}
                    <img 
                      src="/dashboard-demo.gif" 
                      alt="Dashboard Preview" 
                      className="w-full h-full object-cover"
                    />
                 </div>
             </div>
         </div>
      </section>

      {/* Social Proof */}
      <section className="py-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-midnight-lighter">
          <div className="container mx-auto px-4 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Trusted by creators from</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Placeholders for Logos - using text for now but styled like logos */}
                  <span className="text-xl font-black text-gray-400">MEDIUM</span>
                  <span className="text-xl font-black text-gray-400">YOUTUBE</span>
                  <span className="text-xl font-black text-gray-400">LINKEDIN</span>
                  <span className="text-xl font-black text-gray-400">WORDPRESS</span>
                  <span className="text-xl font-black text-gray-400">TIKTOK</span>
              </div>
          </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-24 bg-light-bg dark:bg-dark-bg">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                      One Platform. <span className="text-primary">Endless Potential.</span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      We've combined SEO analysis, script doctoring, and trend spotting into a single, powerful workspace.
                  </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  
                  {/* Card 1: Large Left - SEO */}
                  <div className="md:col-span-2 bg-white dark:bg-midnight-card rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
                      <div className="relative z-10">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                             <SearchIcon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 dark:text-white">SEO & Content Audit</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                              Deep dive into keyword density, SERP intent, and readability. Fix issues before you hit publish.
                          </p>
                          <div className="flex gap-2">
                               <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Keywords</span>
                               <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Links</span>
                               <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">Metadata</span>
                          </div>
                      </div>
                      <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-green-50 to-transparent dark:from-green-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Card 2: Right Top - AI */}
                  <div className="bg-midnight text-white rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                             <BrainIcon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">AI-Ready</h3>
                          <p className="text-gray-300 text-sm">
                             Optimize for Answer Engines (AEO) and Chat Search.
                          </p>
                       </div>
                       <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  </div>

                  {/* Card 3: Left Bottom - Video */}
                  <div className="bg-secondary text-white rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                       <div className="relative z-10">
                          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white">
                             <VideoIcon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Viral Video Scripts</h3>
                          <p className="text-white/80 text-sm">
                             Analyze hooks, pacing, and visual potential for Shorts & Reels.
                          </p>
                       </div>
                       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-black/20"></div>
                  </div>

                  {/* Card 4: Large Right - Competitors */}
                  <div className="md:col-span-2 bg-white dark:bg-midnight-card rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all relative overflow-hidden">
                       <div className="relative z-10">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                             <TargetIcon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2 dark:text-white">Competitive Intelligence</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                              See exactly how you stack up against the top results in your niche.
                          </p>
                          
                          {/* Simulated Chart */}
                          <div className="mt-6 h-24 flex items-end gap-4 opacity-50">
                              <div className="w-1/4 h-1/2 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                              <div className="w-1/4 h-3/4 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
                              <div className="w-1/4 h-full bg-primary rounded-t-lg shadow-lg shadow-primary/30"></div>
                              <div className="w-1/4 h-2/3 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                          </div>
                       </div>
                  </div>

              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-midnight text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                    Start your growth engine.
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Join thousands of marketers who are creating better content, faster.
                </p>
                <div className="flex justify-center gap-4">
                    <NavLink to="/register">
                        <Button size="lg">Get Started for Free</Button>
                    </NavLink>
                    <NavLink to="/login">
                         <Button size="lg" variant="outline" className="border-gray-600 text-white hover:border-white hover:text-white">
                            Log In
                        </Button>
                    </NavLink>
                </div>
            </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;