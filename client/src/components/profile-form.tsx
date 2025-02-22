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
import { useEffect } from "react";
import { triggerConfetti } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { SlideElement } from "@shared/schema";

interface ProfileFormProps {
  profile: Partial<Profile>;
  onChange: (profile: Partial<Profile>) => void;
  templateId?: number;
  isBuiltInTemplate: boolean;
}

function formatFieldLabel(name: string): string {
  // If it's our new format (e.g. "Custom Text 1"), return as is
  if (name.startsWith("Custom Text")) {
    return name;
  }

  // Otherwise handle legacy names by splitting and capitalizing
  return name.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ProfileForm({ profile, onChange, templateId, isBuiltInTemplate }: ProfileFormProps) {
  const { toast } = useToast();

  // Fetch template elements if we have a custom template
  const { data: templateElements = [] } = useQuery<SlideElement[]>({
    queryKey: [`/api/admin/themes/${templateId}/slides/1/elements`],
    enabled: !!templateId && !isBuiltInTemplate,
  });

  // Get text elements that have a name property
  const customTextElements = templateElements.filter(
    (element) => element.elementType === "text" && element.properties?.name
  );

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
      ...Object.fromEntries(
        customTextElements.map((element) => [
          element.properties.name,
          profile[element.properties.name as keyof Profile] || ""
        ])
      ),
    },
  });

  // Reset form when profile or template changes
  useEffect(() => {
    form.reset({
      firstName: profile.firstName || "",
      age: profile.age || 18,
      location: profile.location || "",
      occupation: profile.occupation || "",
      education: profile.education || "",
      interests: profile.interests || "",
      bio: profile.bio || "",
      photoUrl: profile.photoUrl || "https://via.placeholder.com/400x400",
      ...Object.fromEntries(
        customTextElements.map((element) => [
          element.properties.name,
          profile[element.properties.name as keyof Profile] || ""
        ])
      ),
    });
  }, [profile, templateElements, form.reset]);

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

      triggerConfetti();

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
        {/* Show standard fields only for built-in templates */}
        {isBuiltInTemplate && (
          <>
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
          </>
        )}

        {/* Show custom template fields only for custom templates */}
        {!isBuiltInTemplate && customTextElements.map((element) => (
          <FormField
            key={element.id}
            control={form.control}
            name={element.properties.name as keyof InsertProfile}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {formatFieldLabel(element.properties.name)}
                </FormLabel>
                <FormControl>
                  <Input {...field} onChange={(e) => {
                    field.onChange(e);
                    onChange({
                      ...profile,
                      [element.properties.name]: e.target.value
                    });
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" className="w-full">Save Profile</Button>
      </form>
    </Form>
  );
}