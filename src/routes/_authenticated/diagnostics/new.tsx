import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { useCreateDiagnostic } from '~/lib/hooks/useDiagnostics';
import { createDiagnosticSchema, CreateDiagnosticInput } from '~/lib/schemas/diagnostic.schema';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/diagnostics/new')({
  component: NewDiagnosticPage
});

function NewDiagnosticPage() {
  const form = useForm<CreateDiagnosticInput>({
    resolver: zodResolver(createDiagnosticSchema),
    defaultValues: {
      title: '',
      symptoms: [],
      hypotheses: [],
    }
  });

  const createDiagnostic = useCreateDiagnostic();

  async function onSubmit(values: CreateDiagnosticInput) {
    const promise = createDiagnostic.mutateAsync(values);
    
    toast.promise(promise, {
      loading: 'Creating diagnostic report...',
      success: 'Diagnostic created successfully',
      error: (err) => `Failed: ${err.message}`
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Diagnostic Report</CardTitle>
          <CardDescription>Analyze employee performance and identify root causes</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales Performance Gap Analysis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="performanceSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the performance issue..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {value?.map((symptom, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={symptom}
                              onChange={(e) => {
                                const newSymptoms = [...(value || [])];
                                newSymptoms[idx] = e.target.value;
                                onChange(newSymptoms);
                              }}
                            />
                            <Button
                              variant="ghost"
                              onClick={() => onChange(value.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onChange([...(value || []), ''])}
                        >
                          Add Symptom
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createDiagnostic.isPending}>
                {createDiagnostic.isPending ? 'Creating...' : 'Create Report'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
