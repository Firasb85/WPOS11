import { describe, it, expect, vi } from 'vitest';
const mockSupabase = { from: vi.fn() };
vi.mock('@/integrations/supabase/client', () => ({ supabase: mockSupabase }));

describe('BranchesService', () => {
  it('listBranches', async () => {
    const data = [{ id: '1', name: 'Riyadh Branch' }];
    mockSupabase.from.mockReturnValue({ select: vi.fn().mockResolvedValue({ data, error: null }) });
    expect(data).toBeDefined();
  });
});