
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/language/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Select } from "@/components/ui/select";

// Define chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AdminBlogAnalytics() {
  const { currentLanguage } = useLanguage();
  const [timeFrame, setTimeFrame] = useState("30"); // Days
  
  // Stats
  const [statsData, setStatsData] = useState({
    totalPosts: 0,
    totalOriginals: 0,
    totalTranslations: 0,
    publishedPosts: 0,
    draftPosts: 0,
    translationCompletionRate: 0,
  });
  
  // Language distribution data
  const [languageDistribution, setLanguageDistribution] = useState<Array<{name: string, value: number}>>([]);
  
  // Posts over time data
  const [postsOverTime, setPostsOverTime] = useState<Array<{date: string, originals: number, translations: number}>>([]);
  
  // Translation status data
  const [translationStatus, setTranslationStatus] = useState<Array<{name: string, completed: number, pending: number}>>([]);
  
  useEffect(() => {
    const fetchBlogAnalytics = async () => {
      try {
        // Get total counts
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('*');
          
        if (postsError) throw postsError;
        
        // Get translation workflows
        const { data: workflowsData, error: workflowsError } = await supabase
          .from('translation_workflows')
          .select('*');
          
        if (workflowsError) throw workflowsError;
        
        if (postsData) {
          // Calculate basic stats
          const originals = postsData.filter(post => post.is_original);
          const translations = postsData.filter(post => !post.is_original);
          const published = postsData.filter(post => post.status === 'published');
          const drafts = postsData.filter(post => post.status === 'draft');
          
          setStatsData({
            totalPosts: postsData.length,
            totalOriginals: originals.length,
            totalTranslations: translations.length,
            publishedPosts: published.length,
            draftPosts: drafts.length,
            translationCompletionRate: originals.length > 0 
              ? Math.round((translations.length / (originals.length * (SUPPORTED_LANGUAGES.length - 1))) * 100) 
              : 0,
          });
          
          // Calculate language distribution
          const langCounts: Record<string, number> = {};
          postsData.forEach(post => {
            const lang = post.language_code || 'unknown';
            langCounts[lang] = (langCounts[lang] || 0) + 1;
          });
          
          const langDistData = Object.entries(langCounts).map(([code, count]) => {
            const langName = SUPPORTED_LANGUAGES.find(l => l.code === code)?.name || code;
            return { name: langName, value: count };
          });
          
          setLanguageDistribution(langDistData);
          
          // Calculate posts over time
          const days = parseInt(timeFrame);
          const dateRange = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - i - 1));
            return date.toISOString().split('T')[0];
          });
          
          const timeData = dateRange.map(date => {
            const dayOriginals = originals.filter(post => {
              const postDate = new Date(post.created_at).toISOString().split('T')[0];
              return postDate === date;
            }).length;
            
            const dayTranslations = translations.filter(post => {
              const postDate = new Date(post.created_at).toISOString().split('T')[0];
              return postDate === date;
            }).length;
            
            return {
              date: date,
              originals: dayOriginals,
              translations: dayTranslations
            };
          });
          
          setPostsOverTime(timeData);
          
          // Calculate translation status by language
          if (workflowsData) {
            const langStatusData: Record<string, { completed: number, pending: number }> = {};
            
            // Initialize with all supported languages
            SUPPORTED_LANGUAGES.forEach(lang => {
              if (lang.code !== 'en') { // Assuming 'en' is the primary language
                langStatusData[lang.name] = { completed: 0, pending: 0 };
              }
            });
            
            // Count completed and pending translations
            workflowsData.forEach(workflow => {
              workflow.requested_languages.forEach((langCode: string) => {
                const langName = SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name || langCode;
                
                // Skip if it's the primary language
                if (langCode === 'en') return;
                
                if (workflow.completed_languages.includes(langCode)) {
                  langStatusData[langName].completed += 1;
                } else {
                  langStatusData[langName].pending += 1;
                }
              });
            });
            
            // Convert to array format for chart
            const statusData = Object.entries(langStatusData).map(([name, counts]) => ({
              name,
              ...counts
            }));
            
            setTranslationStatus(statusData);
          }
        }
      } catch (error) {
        console.error("Error fetching blog analytics:", error);
      }
    };
    
    fetchBlogAnalytics();
  }, [timeFrame]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Blog Analytics</h2>
        
        <div className="w-full md:w-auto">
          <Select
            defaultValue="30"
            onValueChange={setTimeFrame}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {statsData.totalOriginals} originals, {statsData.totalTranslations} translations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.publishedPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published posts ({Math.round((statsData.publishedPosts / statsData.totalPosts) * 100) || 0}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Translation Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.translationCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Of potential translations completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Language Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>
            Distribution of blog posts by language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {languageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Posts Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Content Creation Timeline</CardTitle>
          <CardDescription>
            Original posts and translations created over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={postsOverTime}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="originals" fill="#0088FE" name="Original Posts" />
                <Bar dataKey="translations" fill="#00C49F" name="Translations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Translation Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Status by Language</CardTitle>
          <CardDescription>
            Completed vs pending translations for each language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={translationStatus}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                <Bar dataKey="pending" fill="#fbbf24" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
