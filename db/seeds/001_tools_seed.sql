-- ================================================
-- SEED 001: Tools for Hub de Herramientas (M-008)
-- Date: November 2025
-- Description: Populate tools table with curated resources
-- ================================================

-- Clear existing data (optional, comment out if you want to preserve existing tools)
-- TRUNCATE TABLE tools CASCADE;

-- ================================================
-- CATEGORY: DESIGN & UI
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key) VALUES
('vercel-v0', 'Vercel V0', 'design', 'https://v0.dev', 'AI component generator - Generate React components with AI', 'Wand2', false),
('shadcn-ui', 'Shadcn/ui', 'design', 'https://ui.shadcn.com', 'Beautiful React component library built with Radix UI', 'Palette', false),
('tailwind-ui', 'Tailwind UI', 'design', 'https://tailwindui.com', 'Premium Tailwind CSS components', 'Layout', false),
('heroicons', 'Heroicons', 'design', 'https://heroicons.com', 'Free MIT-licensed high-quality SVG icons', 'Star', false),
('lucide', 'Lucide Icons', 'design', 'https://lucide.dev', 'Beautiful & consistent icon toolkit', 'Sparkles', false),
('coolors', 'Coolors', 'design', 'https://coolors.co', 'Color palette generator', 'Palette', false),
('shots-so', 'Shots.so', 'design', 'https://shots.so', 'Create amazing mockups', 'Image', false),
('figma', 'Figma', 'design', 'https://figma.com', 'Collaborative design tool', 'Figma', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- CATEGORY: APIs & BACKEND
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key, api_key_placeholder) VALUES
('supabase', 'Supabase', 'api', 'https://supabase.com', 'PostgreSQL + Auth + Storage + Realtime', 'Database', true, 'sbp_...'),
('clerk', 'Clerk', 'api', 'https://clerk.com', 'Authentication & user management', 'Shield', true, 'sk_live_...'),
('stripe', 'Stripe', 'api', 'https://stripe.com', 'Payment processing platform', 'CreditCard', true, 'sk_live_...'),
('resend', 'Resend', 'api', 'https://resend.com', 'Modern transactional email API', 'Mail', true, 're_...'),
('upstash-redis', 'Upstash Redis', 'api', 'https://upstash.com', 'Serverless Redis database', 'Server', true, 'UPSTASH_...'),
('neon', 'Neon', 'api', 'https://neon.tech', 'Serverless PostgreSQL', 'Database', true, 'neon_...'),
('openai', 'OpenAI API', 'api', 'https://platform.openai.com', 'GPT models and AI capabilities', 'Brain', true, 'sk-...'),
('anthropic', 'Anthropic Claude', 'api', 'https://anthropic.com', 'Claude AI models', 'MessageSquare', true, 'sk-ant-...')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- CATEGORY: DEPLOYMENT
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key) VALUES
('vercel', 'Vercel', 'deployment', 'https://vercel.com', 'Frontend deployment platform', 'Zap', false),
('netlify', 'Netlify', 'deployment', 'https://netlify.com', 'Static site hosting & serverless', 'Globe', false),
('railway', 'Railway', 'deployment', 'https://railway.app', 'Deploy apps & databases instantly', 'Train', false),
('render', 'Render', 'deployment', 'https://render.com', 'Unified cloud for apps & databases', 'Cloud', false),
('cloudflare-pages', 'Cloudflare Pages', 'deployment', 'https://pages.cloudflare.com', 'JAMstack platform with global CDN', 'CloudLightning', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- CATEGORY: DEVELOPMENT
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key) VALUES
('nextjs-docs', 'Next.js Docs', 'development', 'https://nextjs.org/docs', 'Official Next.js documentation', 'FileText', false),
('react-docs', 'React Docs', 'development', 'https://react.dev', 'Official React documentation', 'BookOpen', false),
('typescript-playground', 'TypeScript Playground', 'development', 'https://typescriptlang.org/play', 'Try TypeScript in browser', 'Code2', false),
('regex101', 'Regex101', 'development', 'https://regex101.com', 'Regular expression tester', 'Search', false),
('transform-tools', 'Transform.tools', 'development', 'https://transform.tools', 'Convert between formats (JSON, TS, etc)', 'RefreshCw', false),
('bundlephobia', 'Bundlephobia', 'development', 'https://bundlephobia.com', 'Find npm package sizes', 'Package', false),
('caniuse', 'Can I Use', 'development', 'https://caniuse.com', 'Browser support tables', 'CheckCircle', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- CATEGORY: LATAM SPECIFIC
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key, api_key_placeholder, supported_countries) VALUES
('mercado-pago', 'Mercado Pago', 'latam', 'https://mercadopago.com', 'Payment gateway for Latin America', 'DollarSign', true, 'APP_USR...', ARRAY['AR', 'MX', 'BR', 'CL', 'CO', 'PE', 'UY']),
('whatsapp-business', 'WhatsApp Business API', 'latam', 'https://business.whatsapp.com', 'WhatsApp integration for businesses', 'MessageCircle', true, 'EAAB...', ARRAY['AR', 'MX', 'BR', 'CL', 'CO', 'PE', 'ALL']),
('afip-ar', 'AFIP (Argentina)', 'latam', 'https://afip.gob.ar', 'Electronic billing for Argentina', 'FileText', true, 'CUIT...', ARRAY['AR']),
('wompi-co', 'Wompi', 'latam', 'https://wompi.co', 'Payment gateway Colombia', 'CreditCard', true, 'pub_...', ARRAY['CO']),
('clip-mx', 'Clip', 'latam', 'https://clip.mx', 'Payment processing Mexico', 'Smartphone', true, 'sk_...', ARRAY['MX']),
('conekta-mx', 'Conekta', 'latam', 'https://conekta.com', 'Payment platform Mexico', 'Wallet', true, 'key_...', ARRAY['MX'])
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- CATEGORY: INSPIRATION
-- ================================================

INSERT INTO tools (id, name, category, url, description, icon_name, requires_api_key) VALUES
('dribbble', 'Dribbble', 'inspiration', 'https://dribbble.com', 'Design inspiration & community', 'Layers', false),
('behance', 'Behance', 'inspiration', 'https://behance.net', 'Creative portfolios showcase', 'Aperture', false),
('product-hunt', 'Product Hunt', 'inspiration', 'https://producthunt.com', 'Discover new products daily', 'Rocket', false),
('indie-hackers', 'Indie Hackers', 'inspiration', 'https://indiehackers.com', 'Community of founders', 'Users', false),
('awwwards', 'Awwwards', 'inspiration', 'https://awwwards.com', 'Web design awards', 'Award', false)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- VERIFICATION
-- ================================================

-- Count tools by category
DO $$
DECLARE
  design_count INT;
  api_count INT;
  deployment_count INT;
  development_count INT;
  latam_count INT;
  inspiration_count INT;
  total_count INT;
BEGIN
  SELECT COUNT(*) INTO design_count FROM tools WHERE category = 'design';
  SELECT COUNT(*) INTO api_count FROM tools WHERE category = 'api';
  SELECT COUNT(*) INTO deployment_count FROM tools WHERE category = 'deployment';
  SELECT COUNT(*) INTO development_count FROM tools WHERE category = 'development';
  SELECT COUNT(*) INTO latam_count FROM tools WHERE category = 'latam';
  SELECT COUNT(*) INTO inspiration_count FROM tools WHERE category = 'inspiration';
  SELECT COUNT(*) INTO total_count FROM tools;

  RAISE NOTICE '';
  RAISE NOTICE '✅ Tools seed completed successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tools by category:';
  RAISE NOTICE '  🎨 Design & UI:    % tools', design_count;
  RAISE NOTICE '  🔌 APIs & Backend: % tools', api_count;
  RAISE NOTICE '  🚀 Deployment:     % tools', deployment_count;
  RAISE NOTICE '  💻 Development:    % tools', development_count;
  RAISE NOTICE '  🌎 LATAM Specific: % tools', latam_count;
  RAISE NOTICE '  ✨ Inspiration:    % tools', inspiration_count;
  RAISE NOTICE '';
  RAISE NOTICE '📦 Total tools: %', total_count;
  RAISE NOTICE '';
END $$;
