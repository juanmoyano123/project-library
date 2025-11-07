'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Theme {
  id: string;
  name: string;
  description: string;
}

interface ThemeSelectorProps {
  value?: string;
  onChange: (themeId: string | undefined) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch('/api/themes');
        const data = await response.json();
        if (data.success) {
          setThemes(data.data);
        }
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchThemes();
  }, []);

  const selectedTheme = themes.find(t => t.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Design Theme (Optional)
        </Label>
        <Link href="/projects#themes" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
          View all themes
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <Select
        value={value || 'none'}
        onValueChange={(val) => onChange(val === 'none' ? undefined : val)}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? 'Loading themes...' : 'Select a design theme'} />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          <SelectItem value="none">
            <span className="text-muted-foreground">No theme</span>
          </SelectItem>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <span className="font-medium">{theme.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedTheme && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {selectedTheme.description}
        </p>
      )}
    </div>
  );
}
