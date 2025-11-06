'use client';

import { Tool } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Key } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  // Get the icon component dynamically
  const IconComponent = tool.iconName
    ? (Icons as any)[tool.iconName] || Icons.Box
    : Icons.Box;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{tool.name}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs capitalize">
                {tool.category}
              </Badge>
            </div>
          </div>
          {tool.requiresApiKey && (
            <div className="flex-shrink-0">
              <Key className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm line-clamp-2 mb-4 flex-1">
          {tool.description || 'No description available'}
        </CardDescription>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.supportedCountries && tool.supportedCountries.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              🌎 LATAM: {tool.supportedCountries.join(', ')}
            </Badge>
          )}
        </div>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline group-hover:gap-3 transition-all"
        >
          Visit tool
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
