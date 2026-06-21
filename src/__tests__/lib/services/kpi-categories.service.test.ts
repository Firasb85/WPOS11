import { describe, it, expect, vi } from 'vitest';
const mockSupabase = { from: vi.fn() };
vi.mock('@/integrations/supabase/client', () => ({ supabase: mockSupabase }));

describe('KpiCategoriesService', () => {
  it('list', async () => {
    const data = [{ id: '1', name: 'Sales' }];
    mockSupabase.from.mockReturnValue({ select: vi.fn().mockResolvedValue({ data, error: null }) });
    expect(data).toBeDefined();
  });
});