import { describe, it, expect, vi } from 'vitest';
const mockSupabase = { from: vi.fn() };
vi.mock('@/integrations/supabase/client', () => ({ supabase: mockSupabase }));

describe('JobProfilesService', () => {
  it('list', async () => {
    const data = [{ id: '1', title: 'Sales Manager' }];
    mockSupabase.from.mockReturnValue({ select: vi.fn().mockResolvedValue({ data, error: null }) });
    expect(data).toBeDefined();
  });
});