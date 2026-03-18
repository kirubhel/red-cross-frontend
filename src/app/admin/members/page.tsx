"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import api from "@/lib/api";

type Member = {
  id: string;
  firstName: string;
  fatherName: string;
  region: string;
  status: string;
  ercsId: string;
};

// Mock Data
const MOCK_MEMBERS: Member[] = [
  { id: "1", firstName: "Abebe", fatherName: "Kebede", region: "ADDIS_ABABA", status: "Active", ercsId: "ERCS-1001" },
  { id: "2", firstName: "Sara", fatherName: "Tesfaye", region: "OROMIA", status: "Active", ercsId: "ERCS-1002" },
  { id: "3", firstName: "Dawit", fatherName: "Alemu", region: "AMHARA", status: "Grace Period", ercsId: "ERCS-1003" },
  { id: "4", firstName: "Fatima", fatherName: "Hassan", region: "SOMALI", status: "Active", ercsId: "ERCS-1004" },
  { id: "5", firstName: "Yonas", fatherName: "Bekele", region: "SIDAMA", status: "Inactive", ercsId: "ERCS-1005" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [search, setSearch] = useState("");

  // TODO: Replace with real API call
  // useEffect(() => {
  //   api.get('/person').then(res => setMembers(res.data)).catch(console.error);
  // }, []);

  const filteredMembers = members.filter((m) =>
    m.firstName.toLowerCase().includes(search.toLowerCase()) ||
    m.ercsId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Button>Add Member</Button>
      </div>

      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-sm">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ERCS ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Father Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.ercsId}</TableCell>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.fatherName}</TableCell>
                <TableCell>{member.region}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      member.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "Inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}
                  >
                    {member.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="h-8">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Utility class for badge colors (could be moved to global css or utils)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
