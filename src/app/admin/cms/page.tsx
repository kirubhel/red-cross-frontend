"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Languages, 
  Loader2, 
  Globe, 
  Heart, 
  Users, 
  Activity, 
  ArrowRight,
  Droplets,
  Flame,
  Plus,
  Upload,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { translations, Language } from "@/lib/translations";

type CMSContent = typeof translations.en;

export default function CMSPage() {
  const [activeLang, setActiveLang] = useState<Language>('en');
  const [contents, setContents] = useState<Record<Language, CMSContent>>(translations);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isUploading, setIsUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const languages: Language[] = ['en', 'am', 'om'];
      const results = await Promise.all(
        languages.map(lang => 
          api.get(`/config/landing-page?lang=${lang}`)
            .then(res => ({ lang, data: JSON.parse(res.data.content_json) }))
            .catch(() => ({ lang, data: translations[lang] }))
        )
      );
      
      const newContents = { ...contents };
      results.forEach(({ lang, data }) => {
        // Safe deep merge to ensure new keys in translations are preserved
        newContents[lang] = {
          ...translations[lang],
          ...data,
          nav: { ...translations[lang].nav, ...(data?.nav || {}) },
          hero: { ...translations[lang].hero, ...(data?.hero || {}) },
          whoWeAre: { ...translations[lang].whoWeAre, ...(data?.whoWeAre || {}) },
          services: { ...translations[lang].services, ...(data?.services || {}) },
          news: { ...translations[lang].news, ...(data?.news || {}) },
          donation: { ...translations[lang].donation, ...(data?.donation || {}) },
          membership: { 
            ...translations[lang].membership, 
            ...(data?.membership || {}),
            tiers: { ...(translations[lang].membership?.tiers || {}), ...(data?.membership?.tiers || {}) }
          },
          footer: { ...translations[lang].footer, ...(data?.footer || {}) },
          ctaBanner: { ...translations[lang].ctaBanner, ...(data?.ctaBanner || {}) },
          programsSection: { ...translations[lang].programsSection, ...(data?.programsSection || {}) },
          volunteerSection: { ...translations[lang].volunteerSection, ...(data?.volunteerSection || {}) },
          contactSection: { ...translations[lang].contactSection, ...(data?.contactSection || {}) }
        };
      });
      setContents(newContents);
    } catch (err) {
      console.error("Failed to fetch CMS content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (section: keyof CMSContent, field: string, file: File) => {
    setIsUploading(`${section}-${field}`);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateField(section, field, res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/config/landing-page', {
        language_code: activeLang,
        content_json: JSON.stringify(contents[activeLang])
      });
      toast.success(`Changes for ${activeLang === 'en' ? 'English' : activeLang === 'am' ? 'Amharic' : 'Oromiffa'} saved successfully!`);
    } catch (err) {
      console.error("Failed to save CMS content:", err);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: keyof CMSContent, field: string, value: any) => {
    setContents(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [section]: {
          ...(prev[activeLang][section] as any),
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#ED1C24] animate-spin" />
      </div>
    );
  }

  const current = contents[activeLang];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tighter">Landing Page CMS</h1>
          <p className="text-gray-500 font-medium">Manage all public content and translations.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          {(['en', 'am', 'om'] as Language[]).map(l => (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              className={`px-4 py-2 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${activeLang === l ? 'bg-[#ED1C24] text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
            >
              {l === 'en' ? 'English' : l === 'am' ? 'አማርኛ' : 'Oromiffa'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        {/* Navigation Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Navigation Labels</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(current.nav).map(key => (
              <div key={key} className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">{key}</Label>
                <Input 
                  value={(current.nav as any)[key]} 
                  onChange={(e) => updateField('nav', key, e.target.value)}
                  className="rounded-xl border-gray-200 bg-white text-black focus:ring-[#ED1C24]/10 h-12 font-bold shadow-sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center">
                <Flame className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Hero Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Tagline</Label>
                <Input 
                  value={current.hero.tagline} 
                  onChange={(e) => updateField('hero', 'tagline', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Anniversary Text</Label>
                <Input 
                  value={current.hero.anniversary} 
                  onChange={(e) => updateField('hero', 'anniversary', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title Line 1</Label>
                <Input 
                  value={current.hero.title1} 
                  onChange={(e) => updateField('hero', 'title1', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title Line 2 (Red Accent)</Label>
                <Input 
                  value={current.hero.title2} 
                  onChange={(e) => updateField('hero', 'title2', e.target.value)}
                  className="rounded-xl h-12 font-bold text-[#ED1C24] bg-white border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title Line 3</Label>
                <Input 
                  value={current.hero.title3} 
                  onChange={(e) => updateField('hero', 'title3', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Subtitle</Label>
              <Input 
                value={current.hero.subtitle} 
                onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
                className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Hero Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={current.hero.imageUrl} 
                  onChange={(e) => updateField('hero', 'imageUrl', e.target.value)}
                  className="rounded-xl h-12 font-bold border-gray-200 bg-white text-black flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="hero-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload('hero', 'imageUrl', e.target.files[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-12 rounded-xl border-dashed border-[#ED1C24]/30 hover:bg-red-50"
                    onClick={() => document.getElementById('hero-upload')?.click()}
                    disabled={isUploading === 'hero-imageUrl'}
                  >
                    {isUploading === 'hero-imageUrl' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#ED1C24]" />
                    ) : (
                      <Upload className="h-5 w-5 text-[#ED1C24]" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Who We Are Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Who We Are</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Badge</Label>
                <Input value={current.whoWeAre.badge} onChange={(e) => updateField('whoWeAre', 'badge', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Main Section Title</Label>
                <Input value={current.whoWeAre.title} onChange={(e) => updateField('whoWeAre', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Story Heading</Label>
              <Input value={current.whoWeAre.storyTitle} onChange={(e) => updateField('whoWeAre', 'storyTitle', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">History Link URL</Label>
                <Input value={current.whoWeAre.historyLink} onChange={(e) => updateField('whoWeAre', 'historyLink', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-red-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">History Link Label</Label>
                <Input value={current.whoWeAre.historyLinkLabel} onChange={(e) => updateField('whoWeAre', 'historyLinkLabel', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-red-100" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Story Paragraph 1</Label>
                <textarea 
                  value={current.whoWeAre.storyText1} 
                  onChange={(e) => updateField('whoWeAre', 'storyText1', e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-white text-black focus:ring-[#ED1C24]/10 font-bold text-sm shadow-sm placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Story Paragraph 2</Label>
                <textarea 
                  value={current.whoWeAre.storyText2} 
                  onChange={(e) => updateField('whoWeAre', 'storyText2', e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-white text-black focus:ring-[#ED1C24]/10 font-bold text-sm shadow-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="h-px bg-gray-100 my-4" />
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#ED1C24] mb-4">Cards (Mission, Vision, Values)</div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Mission Title</Label>
                  <Input value={current.whoWeAre.missionTitle} onChange={(e) => updateField('whoWeAre', 'missionTitle', e.target.value)} className="rounded-xl h-10 font-bold bg-white text-black border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Mission Text</Label>
                  <textarea value={current.whoWeAre.missionText} onChange={(e) => updateField('whoWeAre', 'missionText', e.target.value)} className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 bg-white text-black font-bold text-[10px]" />
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Vision Title</Label>
                  <Input value={current.whoWeAre.visionTitle} onChange={(e) => updateField('whoWeAre', 'visionTitle', e.target.value)} className="rounded-xl h-10 font-bold bg-white text-black border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Vision Text</Label>
                  <textarea value={current.whoWeAre.visionText} onChange={(e) => updateField('whoWeAre', 'visionText', e.target.value)} className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 bg-white text-black font-bold text-[10px]" />
                </div>
              </div>

              <div className="space-y-4 p-5 rounded-2xl bg-gray-50/50 border border-gray-100">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Values Title</Label>
                  <Input value={current.whoWeAre.valuesTitle} onChange={(e) => updateField('whoWeAre', 'valuesTitle', e.target.value)} className="rounded-xl h-10 font-bold bg-white text-black border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Values Text</Label>
                  <textarea value={current.whoWeAre.valuesText} onChange={(e) => updateField('whoWeAre', 'valuesText', e.target.value)} className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 bg-white text-black font-bold text-[10px]" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">About Image URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={current.whoWeAre.imageUrl} 
                  onChange={(e) => updateField('whoWeAre', 'imageUrl', e.target.value)}
                  className="rounded-xl h-12 font-bold border-gray-200 bg-white text-black flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="who-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload('whoWeAre', 'imageUrl', e.target.files[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-12 rounded-xl border-dashed border-[#ED1C24]/30 hover:bg-red-50"
                    onClick={() => document.getElementById('who-upload')?.click()}
                    disabled={isUploading === 'whoWeAre-imageUrl'}
                  >
                    {isUploading === 'whoWeAre-imageUrl' ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#ED1C24]" />
                    ) : (
                      <Upload className="h-5 w-5 text-[#ED1C24]" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Service Areas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Badge</Label>
                <Input value={current.services.badge} onChange={(e) => updateField('services', 'badge', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title</Label>
                <Input value={current.services.title} onChange={(e) => updateField('services', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
              {current.services.items.map((service, index) => (
                <div key={service.id} className="space-y-4 p-6 rounded-3xl border border-gray-100 bg-gray-50/30">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ED1C24]">{service.id}</h4>
                    <div className={`h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center opacity-50`}>
                      {/* Placeholder for Icon */}
                      <Activity className="h-4 w-4 text-[#ED1C24]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-[#ED1C24] uppercase">Title</Label>
                    <Input 
                      value={service.title} 
                      onChange={(e) => {
                        const newItems = [...current.services.items];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        
                        setContents(prev => ({
                          ...prev,
                          [activeLang]: {
                            ...prev[activeLang],
                            services: {
                              ...prev[activeLang].services,
                              items: newItems
                            }
                          }
                        }));
                      }} 
                      className="rounded-xl h-10 text-sm font-bold bg-white text-black border-gray-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-[#ED1C24] uppercase">Description</Label>
                    <textarea 
                      value={service.desc} 
                      onChange={(e) => {
                        const newItems = [...current.services.items];
                        newItems[index] = { ...newItems[index], desc: e.target.value };
                        
                        setContents(prev => ({
                          ...prev,
                          [activeLang]: {
                            ...prev[activeLang],
                            services: {
                              ...prev[activeLang].services,
                              items: newItems
                            }
                          }
                        }));
                      }} 
                      className="w-full min-h-[100px] p-3 rounded-xl border border-gray-200 bg-white text-black font-bold text-[10px] leading-relaxed shadow-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* News & Media Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">News & Media Labels</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Badge</Label>
              <Input value={current.news.badge} onChange={(e) => updateField('news', 'badge', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title</Label>
              <Input value={current.news.title} onChange={(e) => updateField('news', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">View All Button</Label>
              <Input value={current.news.viewAll} onChange={(e) => updateField('news', 'viewAll', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>
          </CardContent>
        </Card>

        {/* Donation Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Donation Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Badge</Label>
                <Input value={current.donation.badge} onChange={(e) => updateField('donation', 'badge', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title</Label>
                <Input value={current.donation.title} onChange={(e) => updateField('donation', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Membership Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Badge</Label>
                <Input 
                  value={current.membership.badge} 
                  onChange={(e) => updateField('membership', 'badge', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Title</Label>
                <Input 
                  value={current.membership.title} 
                  onChange={(e) => updateField('membership', 'title', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Description</Label>
              <Input 
                value={current.membership.desc} 
                onChange={(e) => updateField('membership', 'desc', e.target.value)}
                className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
              />
            </div>

            {/* Membership Tiers Editor */}
            <div className="pt-8 border-t border-gray-100 space-y-8">
               <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#ED1C24]">Individual Membership Tiers</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(current.membership.tiers?.individual || []).map((tier: any, idx: number) => (
                    <div key={idx} className="space-y-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-black/40">Tier Name</Label>
                          <Input 
                            value={tier.name} 
                            onChange={(e) => {
                               const newIndividual = [...(current.membership.tiers?.individual || [])];
                               newIndividual[idx] = { ...newIndividual[idx], name: e.target.value };
                               updateField('membership', 'tiers', { ...(current.membership.tiers || {}), individual: newIndividual });
                            }}
                            className="rounded-lg h-10 font-bold bg-white text-black border-gray-200"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-black/40">Price/Range</Label>
                          <Input 
                            value={tier.price} 
                            onChange={(e) => {
                               const newIndividual = [...(current.membership.tiers?.individual || [])];
                               newIndividual[idx] = { ...newIndividual[idx], price: e.target.value };
                               updateField('membership', 'tiers', { ...(current.membership.tiers || {}), individual: newIndividual });
                            }}
                            className="rounded-lg h-10 font-bold bg-white text-black border-gray-200"
                          />
                       </div>
                    </div>
                  ))}
               </div>

               <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#ED1C24]">Corporate Membership Tiers</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(current.membership.tiers?.corporate || []).map((tier: any, idx: number) => (
                    <div key={idx} className="space-y-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-black/40">Tier Name</Label>
                          <Input 
                            value={tier.name} 
                            onChange={(e) => {
                               const newCorporate = [...(current.membership.tiers?.corporate || [])];
                               newCorporate[idx] = { ...newCorporate[idx], name: e.target.value };
                               updateField('membership', 'tiers', { ...(current.membership.tiers || {}), corporate: newCorporate });
                            }}
                            className="rounded-lg h-10 font-bold bg-white text-black border-gray-200"
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-black/40">Price/Range</Label>
                          <Input 
                            value={tier.price} 
                            onChange={(e) => {
                               const newCorporate = [...(current.membership.tiers?.corporate || [])];
                               newCorporate[idx] = { ...newCorporate[idx], price: e.target.value };
                               updateField('membership', 'tiers', { ...(current.membership.tiers || {}), corporate: newCorporate });
                            }}
                            className="rounded-lg h-10 font-bold bg-white text-black border-gray-200"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">About Programs (Membership & Donation)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Main Section Title</Label>
              <Input value={current.programsSection.title} onChange={(e) => updateField('programsSection', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Introduction Content</Label>
              <textarea 
                value={current.programsSection.content} 
                onChange={(e) => updateField('programsSection', 'content', e.target.value)}
                className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 bg-white text-black font-bold text-sm leading-relaxed" 
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Membership Sub-title</Label>
                    <Input value={current.programsSection.membershipTitle} onChange={(e) => updateField('programsSection', 'membershipTitle', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Membership Detail</Label>
                    <textarea 
                      value={current.programsSection.membershipContent} 
                      onChange={(e) => updateField('programsSection', 'membershipContent', e.target.value)}
                      className="w-full min-h-[150px] p-4 rounded-xl border border-gray-100 bg-white text-black font-bold text-xs leading-relaxed" 
                    />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Donation Sub-title</Label>
                    <Input value={current.programsSection.donationTitle} onChange={(e) => updateField('programsSection', 'donationTitle', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Donation Detail</Label>
                    <textarea 
                      value={current.programsSection.donationContent} 
                      onChange={(e) => updateField('programsSection', 'donationContent', e.target.value)}
                      className="w-full min-h-[150px] p-4 rounded-xl border border-gray-100 bg-white text-black font-bold text-xs leading-relaxed" 
                    />
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Services Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <UserPlus className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Voluntary Services Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Section Title</Label>
              <Input value={current.volunteerSection.title} onChange={(e) => updateField('volunteerSection', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Description Content</Label>
              <textarea 
                value={current.volunteerSection.content} 
                onChange={(e) => updateField('volunteerSection', 'content', e.target.value)}
                className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 bg-white text-black font-bold text-sm leading-relaxed" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">CTA Headline</Label>
              <Input value={current.volunteerSection.cta} onChange={(e) => updateField('volunteerSection', 'cta', e.target.value)} className="rounded-xl h-12 font-bold text-[#ED1C24] bg-white border-red-50" />
            </div>
          </CardContent>
        </Card>

        {/* Contact Us Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Contact Us Section</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Section Title</Label>
                <Input value={current.contactSection.title} onChange={(e) => updateField('contactSection', 'title', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Location Address</Label>
                <Input value={current.contactSection.address} onChange={(e) => updateField('contactSection', 'address', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Official Email(s)</Label>
                <Input value={current.contactSection.email} onChange={(e) => updateField('contactSection', 'email', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Telephone</Label>
                <Input value={current.contactSection.tel} onChange={(e) => updateField('contactSection', 'tel', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Mobile</Label>
                <Input value={current.contactSection.mobile} onChange={(e) => updateField('contactSection', 'mobile', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24]">Fax</Label>
                <Input value={current.contactSection.fax} onChange={(e) => updateField('contactSection', 'fax', e.target.value)} className="rounded-xl h-12 font-bold bg-white text-black border-gray-200" />
             </div>
          </CardContent>
        </Card>

        {/* Footer & CTA Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <MapPinIcon className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-black tracking-tight text-black">Footer & Global Content</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Footer Description</Label>
              <Input 
                value={current.footer.desc} 
                onChange={(e) => updateField('footer', 'desc', e.target.value)}
                className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">CTA Banner Title</Label>
                <Input 
                  value={current.ctaBanner.title} 
                  onChange={(e) => updateField('ctaBanner', 'title', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#ED1C24] ml-1">Copyright/Rights Text</Label>
                <Input 
                  value={current.footer.rights} 
                  onChange={(e) => updateField('footer', 'rights', e.target.value)}
                  className="rounded-xl h-12 font-bold bg-white text-black border-gray-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Save Button */}
      <div className="sticky bottom-8 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-black hover:bg-[#ED1C24] text-white rounded-2xl h-16 px-10 text-lg font-black flex items-center gap-3 transition-all hover:scale-105 shadow-2xl active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Changes in {activeLang === 'en' ? 'English' : activeLang === 'am' ? 'Amharic' : 'Oromiffa'}
        </Button>
      </div>
    </div>
  );
}

function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
