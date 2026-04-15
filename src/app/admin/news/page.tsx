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
    <div className="space-y-6 w-full max-w-full pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-3xl font-black text-black tracking-tighter leading-none">
            News & <span className="text-[#ED1C24]">Media</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-snug">
            Manage press releases, field updates, and community stories. Changes are reflected on the public portal instantly.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            onClick={fetchNews}
            variant="outline" 
            className="h-10 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 border-gray-200"
          >
            Refresh List
          </Button>
          <Button 
            onClick={handleCreateNew}
            className="h-10 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest bg-[#ED1C24] hover:bg-black text-white transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Write Story
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
         
         {/* News List */}
         <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2">Latest Articles</h3>
            
            <div className="space-y-2">
               {loading ? (
                   <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-2xl">
                      <div className="h-6 w-6 border-4 border-red-50 border-t-[#ED1C24] rounded-full animate-spin" />
                   </div>
               ) : articles.length === 0 ? (
                   <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <Newspaper className="h-8 w-8 text-gray-300 mx-auto mb-3 opacity-50" />
                      <p className="font-bold text-xs text-gray-400">No articles yet. Start writing your first story.</p>
                   </div>
               ) : (
                  articles.map((article) => (
                    <div 
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className={cn(
                        "group cursor-pointer p-4 rounded-xl border transition-all duration-300 relative overflow-hidden",
                        selectedArticle?.id === article.id 
                          ? "bg-black border-black text-white shadow-md scale-[1.01]"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                         <span className={cn(
                             "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1.5",
                             selectedArticle?.id === article.id ? "bg-white/10 text-white" : "bg-gray-100 text-gray-500"
                         )}>
                            {article.is_published ? <CheckCircle2 className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            {article.category}
                         </span>
                         {article.id && (
                           <button 
                             onClick={(e) => handleDelete(e, article.id!)}
                             className={cn(
                               "p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100",
                               selectedArticle?.id === article.id ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                             )}
                           >
                              <Trash2 className="h-3.5 w-3.5" />
                           </button>
                         )}
                      </div>
                      <h4 className={cn(
                          "text-sm font-black tracking-tight leading-tight line-clamp-2",
                          selectedArticle?.id === article.id ? "text-white" : "text-black"
                      )}>
                         {article.title}
                      </h4>
                      <p className={cn(
                          "mt-1.5 text-xs font-medium line-clamp-2",
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                     <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-[#ED1C24]">
                                <Newspaper className="h-5 w-5" />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black text-black tracking-tighter">
                                   {selectedArticle.id ? 'Edit Story' : 'New Story'}
                                 </h3>
                                 <p className="text-gray-400 font-medium text-xs">Craft your article content directly below.</p>
                              </div>
                           </div>
                           
                           <Button 
                             onClick={handleSave}
                             disabled={saving}
                             className="h-10 rounded-xl px-5 font-black text-[10px] uppercase tracking-widest bg-black text-white hover:bg-[#ED1C24] transition-all"
                           >
                             {saving ? "Saving..." : <><Save className="mr-2 h-3.5 w-3.5" /> Save</>}
                           </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                           {/* Main Details */}
                           <div className="md:col-span-2 space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <Type className="h-3 w-3" /> Headline / Title
                             </Label>
                             <Input 
                                 value={selectedArticle.title} 
                                 onChange={(e) => handleUpdateField({ title: e.target.value })}
                                 placeholder="e.g. Critical Aid Distributed..."
                                 className="h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-red-500/20"
                             />
                           </div>

                           <div className="md:col-span-2 space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <FileText className="h-3 w-3" /> Short Excerpt
                             </Label>
                             <textarea 
                                 value={selectedArticle.excerpt} 
                                 onChange={(e) => handleUpdateField({ excerpt: e.target.value })}
                                 placeholder="A brief summary for the cards on the news portal..."
                                 className="w-full rounded-xl bg-gray-50 text-black border-gray-100 font-medium text-sm p-3 min-h-[80px] focus:outline-none focus:ring-1 focus:ring-red-500/20 placeholder:text-gray-400 resize-y"
                             />
                           </div>

                           <div className="space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <Tag className="h-3 w-3" /> Category
                             </Label>
                             <select 
                               value={selectedArticle.category}
                               onChange={(e) => handleUpdateField({ category: e.target.value })}
                               className="flex h-10 w-full rounded-xl bg-gray-50 text-black border border-gray-100 px-3 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-red-500/20 appearance-none"
                             >
                               <option value="EMERGENCY">Emergency</option>
                               <option value="HEALTH">Health</option>
                               <option value="YOUTH">Youth</option>
                               <option value="WATER">Water / WASH</option>
                               <option value="EVENTS">Events</option>
                             </select>
                           </div>

                           <div className="space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <User className="h-3 w-3" /> Author / Source
                             </Label>
                             <Input 
                                 value={selectedArticle.author} 
                                 onChange={(e) => handleUpdateField({ author: e.target.value })}
                                 className="h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-bold text-sm focus:ring-1 focus:ring-red-500/20"
                             />
                           </div>

                           <div className="md:col-span-2 space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <ImageIcon className="h-3 w-3" /> Cover Image URL
                             </Label>
                             <div className="flex items-center gap-2">
                               <Input 
                                   value={selectedArticle.thumbnail_url} 
                                   onChange={(e) => handleUpdateField({ thumbnail_url: e.target.value })}
                                   placeholder="https://..."
                                   className="flex-1 h-10 rounded-xl bg-gray-50 text-black border-gray-100 font-medium text-xs placeholder:text-gray-400 focus:ring-1 focus:ring-red-500/20"
                               />
                               <div className="relative">
                                 <Button 
                                   type="button" 
                                   disabled={uploadingImage}
                                   className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors"
                                 >
                                    {uploadingImage ? "..." : <><UploadCloud className="mr-2 h-3.5 w-3.5" /> Upload</>}
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

                           <div className="md:col-span-2 space-y-1.5">
                             <Label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                 <FileText className="h-3 w-3" /> Full Content
                             </Label>
                             <textarea 
                                 value={selectedArticle.content} 
                                 onChange={(e) => handleUpdateField({ content: e.target.value })}
                                 placeholder="Write your full story here..."
                                 className="w-full rounded-2xl bg-gray-50 text-black border border-gray-100 font-medium text-sm p-4 min-h-[250px] focus:outline-none focus:ring-1 focus:ring-red-500/20 placeholder:text-gray-400 resize-y"
                             />
                           </div>

                           <div className="md:col-span-2 bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-gray-100 mt-2">
                              <div>
                                 <p className="font-black text-black text-sm">Visibility Status</p>
                                 <p className="text-xs text-gray-500 font-medium">Should this article be live on the public portal?</p>
                              </div>
                              <button 
                                onClick={() => handleUpdateField({ is_published: !selectedArticle.is_published })}
                                className={cn(
                                   "h-10 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all",
                                   selectedArticle.is_published 
                                     ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" 
                                     : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                                )}
                              >
                                {selectedArticle.is_published ? (
                                    <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> Published</span>
                                ) : (
                                    <span className="flex items-center gap-1.5"><EyeOff className="h-3.5 w-3.5" /> Draft Hidden</span>
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
                    className="h-full min-h-[400px] bg-white rounded-2xl border border-gray-100 border-dashed flex items-center justify-center p-6"
                  >
                     <div className="text-center max-w-sm">
                        <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                           <Newspaper className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-black text-black tracking-tighter mb-1">Select a Story</h3>
                        <p className="text-gray-400 font-medium text-sm">Choose an article from the list to edit, or create a new one to inform the community.</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
