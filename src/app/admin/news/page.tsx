"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Type,
  FileText,
  Tag,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type NewsArticle = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail_url: string;
  author: string;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
};

const DEFAULT_ARTICLE: NewsArticle = {
  title: "",
  excerpt: "",
  content: "",
  category: "EMERGENCY",
  thumbnail_url: "",
  author: "ERCS Communications",
  is_published: false,
};

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/news?page=1&page_size=50');
      if (res.data.articles) {
        setArticles(res.data.articles);
      }
    } catch (error) {
       toast.error("Failed to load news articles.", {
         icon: <XCircle className="h-5 w-5 text-[#ED1C24]" />
       });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedArticle({ ...DEFAULT_ARTICLE });
  };

  const handleUpdateField = (field: Partial<NewsArticle>) => {
    if (selectedArticle) {
       setSelectedArticle({ ...selectedArticle, ...field });
    }
  };

  const handleSave = async () => {
    if (!selectedArticle) return;
    
    // Basic validation
    if (!selectedArticle.title || !selectedArticle.excerpt) {
       toast.error("Please provide both Title and Excerpt", {
         icon: <XCircle className="h-5 w-5 text-[#ED1C24]" />
       });
       return;
    }

    setSaving(true);
    try {
      if (selectedArticle.id) {
         // Update
         await api.put('/news', { article: selectedArticle });
         toast.success("News article updated successfully", {
           icon: <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
         });
      } else {
         // Create
         await api.post('/news', selectedArticle);
         toast.success("New article published successfully", {
           icon: <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
         });
      }
      fetchNews();
      setSelectedArticle(null);
    } catch (err) {
      toast.error("Failed to save the article.", {
        icon: <XCircle className="h-5 w-5 text-[#ED1C24]" />
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    try {
      const res = await api.post("/storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data?.url) {
         handleUpdateField({ thumbnail_url: res.data.url });
         toast.success("Image uploaded successfully", {
           icon: <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
         });
      }
    } catch (error) {
       toast.error("Failed to upload image.", {
         icon: <XCircle className="h-5 w-5 text-[#ED1C24]" />
       });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this news article?")) return;

    try {
      await api.delete(`/news/${id}`);
      toast.success("Article deleted successfully", {
         icon: <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
      });
      if (selectedArticle?.id === id) {
          setSelectedArticle(null);
      }
      fetchNews();
    } catch (err) {
       toast.error("Failed to delete the article.", {
         icon: <XCircle className="h-5 w-5 text-[#ED1C24]" />
       });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-4 leading-none">
            News & <span className="text-[#ED1C24]">Media</span>
          </h1>
          <p className="text-lg font-bold text-gray-400 leading-snug">
            Manage press releases, field updates, and community stories. Changes are reflected on the public portal instantly.
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <Button 
            onClick={fetchNews}
            variant="outline" 
            className="h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest hover:bg-gray-50 border-gray-200"
          >
            Refresh List
          </Button>
          <Button 
            onClick={handleCreateNew}
            className="h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" /> Write Story
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
         
         {/* News List */}
         <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">Latest Articles</h3>
            
            <div className="space-y-3">
               {loading ? (
                   <div className="h-32 w-full flex items-center justify-center bg-gray-50 rounded-3xl">
                      <div className="h-8 w-8 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                   </div>
               ) : articles.length === 0 ? (
                   <div className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
                      <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4 opacity-50" />
                      <p className="font-bold text-gray-400">No articles yet. Start writing your first story.</p>
                   </div>
               ) : (
                  articles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className={cn(
                        "group cursor-pointer p-6 rounded-[24px] border transition-all duration-300 relative overflow-hidden",
                        selectedArticle?.id === article.id 
                          ? "bg-black border-black text-white shadow-2xl scale-[1.02]"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:scale-[1.01]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                         <span className={cn(
                             "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5",
                             selectedArticle?.id === article.id ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"
                         )}>
                            {article.is_published ? <CheckCircle2 className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            {article.category}
                         </span>
                         {article.id && (
                           <button 
                             onClick={(e) => handleDelete(e, article.id!)}
                             className={cn(
                               "p-2 rounded-xl transition-colors opacity-0 group-hover:opacity-100",
                               selectedArticle?.id === article.id ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                             )}
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                         )}
                      </div>
                      <h4 className={cn(
                          "text-lg font-black tracking-tighter leading-tight line-clamp-2",
                          selectedArticle?.id === article.id ? "text-white" : "text-black"
                      )}>
                         {article.title}
                      </h4>
                      <p className={cn(
                          "mt-2 text-sm font-medium line-clamp-2",
                          selectedArticle?.id === article.id ? "text-gray-400" : "text-gray-500"
                      )}>
                         {article.excerpt}
                      </p>
                    </div>
                  ))
               )}
            </div>
         </div>

         {/* Editor Area */}
         <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
               {selectedArticle ? (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-[40px] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
                  >
                     <div className="p-10 space-y-10">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                           <div className="flex items-center gap-4">
                              <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ED1C24]">
                                <Newspaper className="h-8 w-8" />
                              </div>
                              <div>
                                 <h3 className="text-3xl font-black text-black tracking-tighter">
                                   {selectedArticle.id ? 'Edit Story' : 'New Story'}
                                 </h3>
                                 <p className="text-gray-400 font-medium">Craft your article content directly below.</p>
                              </div>
                           </div>
                           
                           <Button 
                             onClick={handleSave}
                             disabled={saving}
                             className="h-14 rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-black text-white hover:bg-[#ED1C24] transition-all"
                           >
                             {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Article</>}
                           </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                           {/* Main Details */}
                           <div className="md:col-span-2 space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <Type className="h-3 w-3" /> Headline / Title
                             </Label>
                             <Input 
                                 value={selectedArticle.title} 
                                 onChange={(e) => handleUpdateField({ title: e.target.value })}
                                 placeholder="e.g. Critical Aid Distributed..."
                                 className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg placeholder:text-gray-600"
                             />
                           </div>

                           <div className="md:col-span-2 space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <FileText className="h-3 w-3" /> Short Excerpt
                             </Label>
                             <textarea 
                                 value={selectedArticle.excerpt} 
                                 onChange={(e) => handleUpdateField({ excerpt: e.target.value })}
                                 placeholder="A brief summary for the cards on the news portal..."
                                 className="w-full rounded-2xl bg-black text-white border-none font-bold text-base p-6 min-h-[120px] focus:ring-1 focus:ring-red-500/20 placeholder:text-gray-600 resize-y"
                             />
                           </div>

                           <div className="space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <Tag className="h-3 w-3" /> Category
                             </Label>
                             <select 
                               value={selectedArticle.category}
                               onChange={(e) => handleUpdateField({ category: e.target.value })}
                               className="flex h-14 w-full rounded-2xl bg-black text-white border-none px-6 text-lg font-bold focus:ring-1 focus:ring-red-500/20 appearance-none"
                             >
                               <option value="EMERGENCY">Emergency</option>
                               <option value="HEALTH">Health</option>
                               <option value="YOUTH">Youth</option>
                               <option value="WATER">Water / WASH</option>
                               <option value="EVENTS">Events</option>
                             </select>
                           </div>

                           <div className="space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <User className="h-3 w-3" /> Author / Source
                             </Label>
                             <Input 
                                 value={selectedArticle.author} 
                                 onChange={(e) => handleUpdateField({ author: e.target.value })}
                                 className="h-14 rounded-2xl bg-black text-white border-none font-bold text-lg"
                             />
                           </div>

                           <div className="md:col-span-2 space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <ImageIcon className="h-3 w-3" /> Cover Image URL
                             </Label>
                             <div className="flex items-center gap-4">
                               <Input 
                                   value={selectedArticle.thumbnail_url} 
                                   onChange={(e) => handleUpdateField({ thumbnail_url: e.target.value })}
                                   placeholder="https://..."
                                   className="flex-1 h-14 rounded-2xl bg-black text-white border-none font-bold text-sm text-gray-300"
                               />
                               <div className="relative">
                                 <Button 
                                   type="button" 
                                   disabled={uploadingImage}
                                   className="h-14 rounded-2xl px-6 font-black text-xs uppercase tracking-widest bg-gray-100 text-black hover:bg-gray-200 transition-colors"
                                 >
                                    {uploadingImage ? "Uploading..." : <><UploadCloud className="mr-2 h-4 w-4" /> Upload</>}
                                 </Button>
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   onChange={handleImageUpload}
                                   disabled={uploadingImage}
                                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                                 />
                               </div>
                             </div>
                           </div>

                           <div className="md:col-span-2 space-y-2">
                             <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <FileText className="h-3 w-3" /> Full Content
                             </Label>
                             <textarea 
                                 value={selectedArticle.content} 
                                 onChange={(e) => handleUpdateField({ content: e.target.value })}
                                 placeholder="Write your full story here..."
                                 className="w-full rounded-3xl bg-black text-white border-none font-medium text-base p-8 min-h-[300px] focus:ring-1 focus:ring-red-500/20 placeholder:text-gray-600 resize-y"
                             />
                           </div>

                           <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 mt-4">
                              <div>
                                 <p className="font-black text-black text-lg">Visibility Status</p>
                                 <p className="text-sm text-gray-500 font-bold">Should this article be live on the public portal?</p>
                              </div>
                              <button 
                                onClick={() => handleUpdateField({ is_published: !selectedArticle.is_published })}
                                className={cn(
                                   "h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                   selectedArticle.is_published 
                                     ? "bg-[#ECFDF5] text-[#065F46] border border-[#10B981]/10 hover:bg-[#D1FAE5]" 
                                     : "bg-white text-gray-400 border border-gray-200 hover:bg-gray-100"
                                )}
                              >
                                {selectedArticle.is_published ? (
                                    <span className="flex items-center gap-2"><Eye className="h-4 w-4" /> Published</span>
                                ) : (
                                    <span className="flex items-center gap-2"><EyeOff className="h-4 w-4" /> Draft Hidden</span>
                                )}
                              </button>
                           </div>

                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full min-h-[600px] bg-white rounded-[40px] border border-gray-100 border-dashed flex items-center justify-center p-10"
                  >
                     <div className="text-center max-w-sm">
                        <div className="h-20 w-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-6">
                           <Newspaper className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black text-black tracking-tighter mb-2">Select a Story</h3>
                        <p className="text-gray-400 font-bold">Choose an article from the list to edit, or create a new one to inform the community.</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
