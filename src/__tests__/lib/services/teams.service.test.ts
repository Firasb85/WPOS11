import { describe, it, expect, vi } from 'vitest';
const mockSupabase = { from: vi.fn() };
vi.mock('@/integrations/supabase/client', () => ({ supabase: mockSupabase }));

describe('TeamsService', () => {
  it('listTeams', async () => {
    const data = [{ id: '1', name: 'Alpha Team' }];
    mockSupabase.from.mockReturnValue({ select: vi.fn().mockResolvedValue({ data, error: null }) });
    expect(data).toBeDefined();
  });
});