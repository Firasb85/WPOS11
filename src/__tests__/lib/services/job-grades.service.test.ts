import { describe, it, expect, vi } from 'vitest';
const mockSupabase = { from: vi.fn() };
vi.mock('@/integrations/supabase/client', () => ({ supabase: mockSupabase }));

describe('JobGradesService', () => {
  it('list', async () => {
    const data = [{ id: '1', name: 'Grade 5' }];
    mockSupabase.from.mockReturnValue({ select: vi.fn().mockResolvedValue({ data, error: null }) });
    expect(data).toBeDefined();
  });
});