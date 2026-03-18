"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DonatePage() {
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [provider, setProvider] = useState("TELEBIRR"); // TELEBIRR or CHAPA
  const [loading, setLoading] = useState(false);

  const finalAmount = customAmount || amount;

  const handleDonate = async () => {
    setLoading(true);
    // TODO: Call API /api/v1/payment/initiate
    console.log(`Donating ${finalAmount} via ${provider}`);
    
    // Simulate API redirect
    setTimeout(() => {
        setLoading(false);
        alert(`Redirecting to ${provider} checkout for ${finalAmount} ETB...`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="px-6 py-4 bg-white border-b border-gray-200">
           <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to Home
           </Link>
       </header>

       <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="text-center">
                 <div className="mx-auto w-12 h-12 relative mb-2">
                     <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-contain" />
                 </div>
                <CardTitle className="text-2xl font-bold">Make a Donation</CardTitle>
                <p className="text-gray-500">Your support helps us save lives.</p>
            </CardHeader>
            <CardContent className="space-y-8">
                
                {/* Amount Selection */}
                <div className="space-y-3">
                    <Label>Select Amount (ETB)</Label>
                    <div className="grid grid-cols-3 gap-3">
                        {["50", "100", "500", "1000"].map((val) => (
                            <button
                                key={val}
                                onClick={() => { setAmount(val); setCustomAmount(""); }}
                                className={cn(
                                    "py-2 rounded-md border font-medium transition-colors",
                                    amount === val && !customAmount
                                        ? "bg-ercs-red text-white border-ercs-red"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-ercs-red"
                                )}
                            >
                                {val}
                            </button>
                        ))}
                         <div className="col-span-2 relative">
                            <span className="absolute left-3 top-2 text-gray-500">ETB</span>
                            <Input 
                                placeholder="Other Amount" 
                                className="pl-12"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                onFocus={() => setAmount("")}
                            />
                        </div>
                    </div>
                </div>

                {/* Provider Selection */}
                <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            onClick={() => setProvider("TELEBIRR")}
                            className={cn(
                                "cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                provider === "TELEBIRR" ? "border-ercs-red bg-red-50 ring-1 ring-ercs-red" : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">TB</div>
                            <span className="font-medium">Telebirr</span>
                        </div>
                        <div 
                            onClick={() => setProvider("CHAPA")}
                            className={cn(
                                "cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all",
                                provider === "CHAPA" ? "border-ercs-red bg-red-50 ring-1 ring-ercs-red" : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                             <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">CH</div>
                            <span className="font-medium">Chapa</span>
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Donation</span>
                    <span className="text-xl font-bold text-ercs-red">{finalAmount} ETB</span>
                </div>

                <Button 
                    className="w-full h-12 text-lg bg-ercs-red hover:bg-ercs-dark" 
                    onClick={handleDonate}
                    disabled={loading || !finalAmount}
                >
                    {loading ? "Processing..." : `Donate ${finalAmount} ETB`}
                </Button>

                <p className="text-xs text-center text-gray-400">
                    Secure payment processed by {provider === 'TELEBIRR' ? 'Telebirr' : 'Chapa'}.
                </p>
            </CardContent>
        </Card>
       </main>
    </div>
  );
}
