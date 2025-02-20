import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertProfileSchema, type Profile } from "@shared/schema";
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
import { apiRequest } from "@/lib/queryClient";

interface ProfileFormProps {
  profile: Partial<Profile>;
  onChange: (profile: Partial<Profile>) => void;
}

export default function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      ...profile,
      age: profile.age || 0,
    },
  });

  const onSubmit = async (data: Profile) => {
    try {
      await apiRequest("POST", "/api/profiles", data);
      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully",
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
                    const value = parseInt(e.target.value) || 0;
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