import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertProfileSchema, type Profile, type InsertProfile } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  profile: Partial<Profile>;
  onChange: (profile: Partial<Profile>) => void;
}

export default function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      age: profile.age || 18,
      location: profile.location || "",
      occupation: profile.occupation || "",
      education: profile.education || "",
      interests: profile.interests || "",
      bio: profile.bio || "",
      photoUrl: profile.photoUrl || "https://via.placeholder.com/400x400",
    },
  });

  const onSubmit = async (data: InsertProfile) => {
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, firstName: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(value);
                    onChange({ ...profile, age: value });
                  }}
                  min={18}
                  max={120}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, location: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, occupation: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, education: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <Textarea {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, interests: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} onChange={(e) => {
                  field.onChange(e);
                  onChange({ ...profile, bio: e.target.value });
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Profile</Button>
      </form>
    </Form>
  );
}