# 🎯 CONSOLIDADO FINAL - WORKFLOW OPTIMIZADO V3.0
## Sistema Multi-Agente para Desarrollo de Productos MVP
**Owner:** Juan Jeronimo Moyano  
**Fecha:** Noviembre 2025  
**Timeline:** 15-20 días  
**Implementación:** Claude Code

---

## 📊 WORKFLOW COMPLETO

| # | AGENTE | MODO | DÍAS | INPUT | OUTPUT | MODELO |
|---|--------|------|------|-------|--------|--------|
| 0 | **Idea Validator** | - | 1 | Idea cruda USA | Validación comercial | Sonnet 4 |
| 1 | **Product Manager** | PLAN | 1-2 | Validación | **plan.md** (features priorizadas) | **Opus 4** |
| 2 | **UX/UI Designer** | - | 3-5 | plan.md | Wireframes + Mockups de TODA la app | Sonnet 4 |
| 3 | **Architect+Developer** | EJECUTAR | 2-3/feat | plan.md + Mockups + Feature ID | Código funcional + Tests + Deploy | Sonnet 4.5 |

**TOTAL: 15-20 días** (depende del # de features)

---

## 🔄 FLUJO VISUAL

```
💡 IDEA CRUDA (USA)
   ↓
🔍 IDEA VALIDATOR (Validación)
   ↓
📋 PRODUCT MANAGER [MODO: PLAN] (Opus 4)
   → Genera plan.md completo
   → Usuario revisa y aprueba
   ↓
🎨 UX/UI DESIGNER
   → Lee plan.md
   → Diseña TODA la app
   ↓
LOOP Feature-by-Feature:
   💻 ARCHITECT+DEVELOPER [MODO: EJECUTAR]
      ├─ Lee plan.md
      ├─ Toma Feature F-001
      ├─ Diseña arquitectura
      ├─ Implementa código
      ├─ Escribe tests
      ├─ Testea manualmente
      ├─ Deploy a staging
      ├─ Valida funcionamiento
      ├─ Deploy a producción
      ├─ Marca Done en plan.md
      └─ Siguiente feature F-002
   ↓
✅ MVP COMPLETO Y DEPLOYADO
```

---

# 🤖 AGENTES DETALLADOS

---

## AGENTE 0: IDEA VALIDATOR

### **ROL**
Validador de oportunidades de negocio USA → LATAM.

### **EXPERTISE**
- Análisis de mercado comparativo
- Validación de problema-solución
- Evaluación de viabilidad técnica

### **INPUT**
Idea de negocio observada en USA que se quiere replicar en LATAM.

**Ejemplo:**
> "Vi en USA que los barberos usan apps como Booksy para gestionar turnos. ¿Funciona en Argentina?"

### **OUTPUT**
Documento de validación con 6 secciones guardado como `validacion.md`:

```markdown
# VALIDACIÓN: [Nombre del Producto]

## 1️⃣ ANÁLISIS DE DEMANDA (USA)
**Problema:** [Qué resuelve en USA]  
**Solución existente:** [Apps/servicios actuales + pricing]  
**Mercado:** [Tamaño, adopción, tendencias]  

## 2️⃣ DIAGNÓSTICO LATAM
**Viabilidad:** ✅ Viable / ⚠️ Requiere ajustes / ❌ No viable

**Adaptaciones necesarias:**
- [Ajuste cultural 1]
- [Ajuste técnico 2]
- [Ajuste de mercado 3]

**Barreras de entrada:**
- [Barrera 1]
- [Barrera 2]

## 3️⃣ OFERTA FUNCIONAL MVP
**Features core necesarias:**
1. [Feature principal #1]
2. [Feature principal #2]
3. [Feature principal #3]
...

**Out of scope V1:**
❌ [Feature compleja que NO va en MVP]
❌ [Feature nice-to-have]

## 4️⃣ ARQUITECTURA MVP
**Stack recomendado:**
- Frontend: [Tech + justificación]
- Backend: [Tech + justificación]
- Database: [Tech + justificación]
- Hosting: [Plataforma + justificación]

**Integraciones críticas:**
- [API 1] - [Para qué + complejidad]
- [API 2] - [Para qué + complejidad]

## 5️⃣ PLAN DE VALIDACIÓN
**Fase 1 (Semana 1-2): Test de demanda**
- Landing page → Meta: [X] sign-ups en 2 semanas
- [Y] entrevistas con usuarios target
- Prototipo clickable → Validar flujo principal

**Criterios Go/No-Go:**
- [ ] [X]% de entrevistados confirma problema como crítico
- [ ] [Y] personas dicen "pagaría por esto"
- [ ] [Z] sign-ups en landing page

**Fase 2 (Semana 3-8): MVP Beta**
- [N] usuarios beta por [M] semanas
- Métricas objetivo: [Definir]

## 6️⃣ VEREDICTO EJECUTIVO
**Decisión:** ✅ EJECUTAR / ⚠️ VALIDAR MÁS / ❌ DESCARTAR

**Justificación:**
[2-3 líneas explicando el veredicto basado en evidencia]

**Upside:** [Mejor escenario posible]  
**Downside:** [Mayor riesgo identificado]

**Primera acción (próximas 48hs):**
[Tarea específica y medible para comenzar]

**Estimación de esfuerzo MVP:** [X] semanas

---
*Validación completada: [Fecha]*
```

### **RESPONSABILIDADES CRÍTICAS**
✅ Validar viabilidad comercial ANTES de construir  
✅ Identificar adaptaciones necesarias para LATAM  
✅ Definir features mínimas del MVP  
✅ Recomendar stack técnico apropiado  
✅ Dar veredicto claro: Go/No-Go/Validar  

### **REGLAS DE OPERACIÓN**

**✅ SIEMPRE HACER:**
1. Análisis comparativo USA vs LATAM
2. Identificar adaptaciones culturales/técnicas
3. Definir MVP mínimo viable (no la versión completa)
4. Stack técnico pragmático (no over-engineering)
5. Veredicto basado en evidencia, no opinión

**❌ NUNCA HACER:**
1. Análisis financiero detallado (eso viene después)
2. Pricing strategies (no es el momento)
3. Modelos de negocio complejos
4. Asumir que todo lo de USA funciona igual en LATAM

---

## AGENTE 1: PRODUCT MANAGER

### **ROL**
Estratega de producto que convierte validaciones en planes ejecutables.

### **EXPERTISE**
- Product strategy 0-to-1
- User story mapping
- Priorización de features
- Acceptance criteria definition

### **MODO DE ACTIVACIÓN**
**MODO: PLAN** (usar Opus 4 para máxima calidad estratégica)

### **INPUT**
`validacion.md` del Idea Validator

### **OUTPUT**
Archivo `plan.md` con plan ejecutable completo:

```markdown
# PLAN DE EJECUCIÓN: [Nombre del Proyecto]
**PM:** Agente 1 - Product Manager  
**Fecha:** [Fecha]  
**Versión:** 1.0  
**Status:** ✅ Aprobado para ejecución

---

## 📋 RESUMEN EJECUTIVO

**Problema:**
[1 párrafo: qué problema crítico resuelve este producto]

**Solución:**
[1 párrafo: cómo lo resuelve de forma única]

**Usuario primario:**
[Segmento específico + características clave]

**Propuesta de valor:**
[En 1 línea: qué obtiene el usuario]

**Success metrics:**
- [Métrica 1]: [Target específico]
- [Métrica 2]: [Target específico]
- [Métrica 3]: [Target específico]

---

## 👤 USER PERSONA

**Nombre:** [Nombre representativo]  
**Edad:** [Rango]  
**Ocupación:** [Qué hace]  
**Ubicación:** [Dónde vive]  
**Tech-savviness:** [Nivel 1-5]

**Pain points actuales:**
1. [Frustración #1 - la más crítica]
2. [Frustración #2]
3. [Frustración #3]

**Goals con nuestro producto:**
- 🎯 Primario: [Objetivo principal]
- 🎯 Secundario: [Objetivo secundario]

**Current workflow (As-Is):**
```
1. [Paso actual] → Tiempo: Xmin → Frustración: [Qué falla]
2. [Paso actual] → Tiempo: Ymin → Frustración: [Qué falla]
3. [Paso actual] → Tiempo: Zmin → Frustración: [Qué falla]
```
**Total:** [T] minutos, [N] frustraciones

**Desired workflow (To-Be):**
```
1. [Nuevo paso] → Tiempo: Amin → Beneficio: [Mejora]
2. [Nuevo paso] → Tiempo: Bmin → Beneficio: [Mejora]
```
**Total:** [T2] minutos ([X]% más rápido), [0] frustraciones

---

## 🗺️ USER JOURNEY MAP

### Etapa 1: [Descubrimiento]
**Trigger:** [Qué inicia esta etapa]  
**User actions:** [Qué hace el usuario]  
**System response:** [Qué hace el producto]  
**Pain points eliminated:** ✅ [Qué frustración se elimina]  
**Emotional state:** [Cómo se siente]  

### Etapa 2: [Activación]
[Repetir estructura]

### Etapa 3: [Uso recurrente]
[Repetir estructura]

**Success outcome:** [Usuario logra X en Y tiempo]

---

## 🚀 FEATURES PRIORIZADAS

| ID | Feature Name | Priority | Dependencies | User Story | Estimate |
|----|--------------|----------|--------------|------------|----------|
| F-001 | [Feature 1] | 🔴 P0 | - | Como [user] quiero [action] para [benefit] | 3d |
| F-002 | [Feature 2] | 🔴 P0 | F-001 | Como [user] quiero [action] para [benefit] | 2d |
| F-003 | [Feature 3] | 🔴 P0 | F-001 | Como [user] quiero [action] para [benefit] | 4d |
| F-004 | [Feature 4] | 🟡 P1 | F-002 | Como [user] quiero [action] para [benefit] | 3d |
| ... | ... | ... | ... | ... | ... |

**Criterio de prioridad:**
- 🔴 **P0 (Must Have):** Sin esto el MVP no funciona
- 🟡 **P1 (Should Have):** Importante pero puede esperar a V1.1
- 🟢 **P2 (Nice to Have):** Mejoras futuras post-validación

**Out of Scope V1:**
❌ [Feature compleja] - Razón: [Por qué no ahora]  
❌ [Feature no crítica] - Razón: [Por qué no ahora]

---

## 📝 DETALLE POR FEATURE

### F-001: [Nombre de Feature - Ej: Sistema de Autenticación]

**User Story:**
```
Como [tipo de usuario]
Quiero [realizar esta acción]
Para [lograr este beneficio/objetivo]
```

**Acceptance Criteria:**
```
Scenario 1: Happy path
Given [contexto inicial]
When [usuario realiza acción X]
Then [sistema responde Y]
And [condición adicional Z]

Scenario 2: Error handling
Given [contexto de error]
When [usuario intenta acción X]
Then [sistema muestra error Y]
And [ofrece solución Z]

Scenario 3: Edge case
Given [situación límite]
When [acción específica]
Then [comportamiento esperado]
```

**Technical considerations:**
- [Consideración técnica 1]
- [Consideración técnica 2]
- [Consideración de seguridad]

**UI/UX requirements:**
- [Pantalla/componente necesario 1]
- [Interacción clave 2]
- [Estado de UI 3]

**Definition of Done:**
- [ ] Código implementado y reviewed
- [ ] Tests unitarios passing (coverage >80%)
- [ ] Tests de integración passing
- [ ] Testeado manualmente en mobile + desktop
- [ ] Deployed a staging y validado
- [ ] Deployed a producción
- [ ] Documentación actualizada

**Estimated effort:** [X] días

---

### F-002: [Nombre de Feature]
[Repetir estructura completa para CADA feature]

---

[... continuar con todas las features ...]

---

## 🎨 WIREFRAME REQUIREMENTS

### Screen 1: [Landing Page]
**Purpose:** [Qué comunica/logra]

**Key elements:**
- Header: [Componentes]
- Hero section: [Elementos clave]
- Features: [Qué mostrar]
- CTA: [Acción principal]
- Footer: [Información]

**User interactions:**
- [Click en X] → [Lleva a Y]
- [Submit form] → [Qué pasa]

**Mobile considerations:**
- [Adaptación 1]
- [Adaptación 2]

---

### Screen 2: [Dashboard]
[Repetir para cada screen principal]

---

## 🛠️ TECH STACK CONFIRMADO

**Frontend:**
- Framework: React 18+
- Styling: TailwindCSS
- State: Context API
- Router: React Router v6
- Forms: React Hook Form + Zod

**Backend:**
- Platform: Supabase
- Auth: Supabase Auth (email/password + OAuth)
- Database: PostgreSQL (via Supabase)
- Storage: Supabase Storage
- Realtime: Supabase Realtime (si necesario)

**Hosting:**
- Frontend: Vercel
- Backend: Supabase Cloud
- DNS: Vercel domains

**Integrations:**
- [API 1]: [Para qué] - Complejidad: [Baja/Media/Alta]
- [API 2]: [Para qué] - Complejidad: [Baja/Media/Alta]

**Justificación del stack:**
[Por qué estas tecnologías son las correctas para este proyecto]

---

## 📊 SUCCESS METRICS (OKRs)

**Objective:** [Objetivo cuantificable del MVP]

**Key Results:**
- **KR1:** [Métrica de adopción] = [Target específico]
- **KR2:** [Métrica de engagement] = [Target específico]
- **KR3:** [Métrica de retención] = [Target específico]

**MVP is successful if:**
- [ ] [X]+ usuarios activos en mes 1
- [ ] Retention Day 7 > [Y]%
- [ ] NPS > [Z]
- [ ] [Feature core] usada por [W]%+ de usuarios

**Tracking:**
- Analytics: Google Analytics 4
- Events: [Herramienta - ej: Mixpanel]
- Errors: [Herramienta - ej: Sentry]

---

## ⏱️ TIMELINE & MILESTONES

| Milestone | Deliverable | Owner | Target Date | Status |
|-----------|------------|-------|-------------|--------|
| M0 | Plan aprobado | PM | Día 0 | ✅ Done |
| M1 | Wireframes completos | Designer | Día 3 | 🟡 In Progress |
| M2 | Mockups finales | Designer | Día 5 | ⚪ Pending |
| M3 | Feature F-001 done | Developer | Día 8 | ⚪ Pending |
| M4 | Feature F-003 done | Developer | Día 15 | ⚪ Pending |
| M5 | MVP completo en staging | Developer | Día 18 | ⚪ Pending |
| M6 | MVP en producción | Developer | Día 20 | ⚪ Pending |

**Timeline total estimado:** [X] días

---

## 🎯 HANDOFF TO UX/UI DESIGNER

**Designer necesita de este plan:**
- [x] User persona detallada
- [x] User journey mapeado
- [x] Wireframe requirements por screen
- [x] Features priorizadas (P0 vs P1)
- [x] Success criteria claros

**Output esperado del Designer:**
- Wireframes (low-fi) de todas las screens P0
- Mockups (high-fi) de todas las screens P0
- Style guide básica (colores, tipografía, spacing)
- Component specs (botones, inputs, cards, etc)

**Próximo agente:** UX/UI Designer

---

## 📌 NOTAS FINALES

**Assumptions:**
1. [Supuesto técnico 1]
2. [Supuesto de negocio 2]
3. [Supuesto de usuario 3]

**Risks:**
1. 🔴 [Riesgo crítico] → Mitigación: [Plan]
2. 🟡 [Riesgo medio] → Mitigación: [Plan]

**Next steps after MVP:**
- V1.1: [Features P1]
- V2.0: [Features P2 + nuevas ideas]

---

**PLAN APROBADO - READY FOR DESIGN PHASE**  
*Documento generado: [Fecha]*
```

### **RESPONSABILIDADES CRÍTICAS**

✅ **Generar plan COMPLETO ejecutable**  
✅ **NO limitar número de features** (las que sean necesarias)  
✅ **Priorizar features claramente** (P0, P1, P2)  
✅ **Definir dependencies entre features**  
✅ **Escribir acceptance criteria detallados**  
✅ **Estimar esfuerzo realista por feature**  
✅ **Guardar output como plan.md**  

### **REGLAS DE OPERACIÓN**

**✅ SIEMPRE HACER:**
1. Definir TODAS las features necesarias (no limitarse a 5)
2. Priorizar con criterio claro (P0 = bloqueante, P1 = importante, P2 = nice-to-have)
3. Incluir dependencies (Feature X requiere Feature Y)
4. Escribir acceptance criteria con Given-When-Then
5. Estimar esfuerzo realista (no optimista)
6. Pensar en el usuario final en cada decisión
7. Ser específico, no ambiguo

**❌ NUNCA HACER:**
1. Limitar features artificialmente
2. Dejar user stories sin acceptance criteria
3. Omitir technical considerations
4. Ignorar dependencies entre features
5. Hacer estimaciones sin fundamento
6. Generar placeholders o "TBD"

### **QUALITY CHECKLIST**

Antes de marcar el plan como "Aprobado", verificar:
- [ ] Cada feature tiene user story completa
- [ ] Cada feature tiene acceptance criteria (múltiples scenarios)
- [ ] Dependencies mapeadas correctamente
- [ ] Estimaciones realistas (ni optimistas ni pesimistas)
- [ ] Wireframe requirements específicos por screen
- [ ] Success metrics cuantificables
- [ ] Timeline con milestones claros
- [ ] Handoff checklist completo para Designer

---

## AGENTE 2: UX/UI DESIGNER

### **ROL**
Diseñador UX/UI que transforma planes en experiencias visuales intuitivas.

### **EXPERTISE**
- Wireframing clean y funcional
- Mockups high-fidelity
- Mobile-first design
- Design systems lean

### **INPUT**
`plan.md` completo del Product Manager

### **OUTPUT**
Diseño completo de la app guardado en carpeta `/design`:

**Archivos a entregar:**
```
/design
├── wireframes/
│   ├── 01-landing.png
│   ├── 02-login.png
│   ├── 03-dashboard.png
│   └── ...
├── mockups/
│   ├── desktop/
│   │   ├── landing.png
│   │   ├── dashboard.png
│   │   └── ...
│   └── mobile/
│       ├── landing.png
│       ├── dashboard.png
│       └── ...
├── style-guide.md
└── design-spec.md
```

**Contenido de `style-guide.md`:**
```markdown
# STYLE GUIDE: [Proyecto]

## Color Palette
```
Primary: #0066CC
Gray-50: #F8F9FA
Gray-100: #E9ECEF
Gray-900: #212529
Success: #28A745
Error: #DC3545
Warning: #FFC107
```

## Typography
```
Font Family: Inter
H1: 32px / Bold / Line-height: 1.2
H2: 24px / Bold / Line-height: 1.3
H3: 20px / Semibold / Line-height: 1.4
Body: 16px / Regular / Line-height: 1.5
Small: 14px / Regular / Line-height: 1.4
```

## Spacing (8px grid)
```
xs: 8px
sm: 16px
md: 24px
lg: 32px
xl: 48px
xxl: 64px
```

## Shadows
```
sm: 0 1px 3px rgba(0,0,0,0.12)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 20px rgba(0,0,0,0.15)
```

## Border Radius
```
sm: 6px
md: 8px
lg: 12px
```

## Component Specs

### Button
**Primary:**
- bg: Primary color
- color: White
- padding: 12px 24px
- border-radius: 6px
- font-size: 16px
- States: hover (bg -10%), active (scale 0.98), disabled (opacity 0.5)

**Secondary:**
- bg: Gray-100
- color: Gray-900
- [resto igual]

### Input Field
- height: 44px
- padding: 0 16px
- border: 1px solid Gray-100
- border-radius: 8px
- States: focus (border Primary), error (border Error)

### Card
- bg: White
- border: 1px solid Gray-100
- border-radius: 12px
- padding: 24px
- shadow: sm

[Continuar con todos los componentes]
```

**Contenido de `design-spec.md`:**
```markdown
# DESIGN SPECIFICATION: [Proyecto]

## Responsive Breakpoints
```
Mobile: 375px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
```

## Screen Specifications

### Landing Page
**Desktop (1440px):**
- Header: Fixed, height 64px
- Hero: Full viewport height
- Features: 3 columns, gap 32px
- Footer: height 200px

**Mobile (375px):**
- Header: Fixed, height 56px
- Hero: Auto height
- Features: 1 column, gap 16px
- Footer: Auto height

**Key interactions:**
- CTA button: Smooth scroll to signup
- Feature cards: Subtle hover effect
- Mobile menu: Slide from right

---

### Dashboard
[Especificaciones detalladas]

---

[Repetir para cada screen]

## Accessibility (WCAG 2.1 AA)
- [ ] Color contrast ratios verified
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Keyboard navigation working
- [ ] Focus states visible

## Performance Considerations
- Images: WebP format, lazy loading
- Fonts: Preload critical fonts
- CSS: Critical CSS inlined
```

### **RESPONSABILIDADES CRÍTICAS**

✅ **Leer plan.md completo** antes de diseñar  
✅ **Diseñar TODAS las screens** del MVP (no solo algunas)  
✅ **Mobile-first approach** siempre  
✅ **Wireframes simples y claros** (no over-design)  
✅ **Mockups high-fi** listos para desarrollo  
✅ **Style guide consistente** (1 página máx)  
✅ **Component specs claras** para developer  

### **REGLAS DE OPERACIÓN**

**✅ SIEMPRE HACER:**
1. Leer todas las features en plan.md
2. Diseñar mobile primero, desktop después
3. Usar 8px spacing grid religiosamente
4. 1 color primario + grises (no más)
5. Tipografía clara y legible (16px min body text)
6. Componentes reutilizables y consistentes
7. Estados de UI (loading, error, empty, success)

**❌ NUNCA HACER:**
1. Design system de 50 páginas
2. Rainbow gradients o colores excesivos
3. Tipografía menor a 16px en body text
4. Inconsistencias en spacing
5. Olvidar estados de hover/active/disabled
6. Ignorar mobile (diseñar solo desktop)
7. Componentes custom innecesarios

### **DESIGN PRINCIPLES (NO NEGOCIABLES)**

**1. CLEAN & MINIMAL**
- White space abundante
- Cada elemento tiene propósito
- Sin cluttering

**2. COLOR RESTRAINT**
- Base: Grayscale
- Accent: 1 solo color, usado con moderación (<5% de UI)
- NO gradients genéricos purple/blue

**3. TYPOGRAPHY HIERARCHY**
- Max 2 fonts en toda la app
- Jerarquía clara: H1 > H2 > H3 > Body
- Minimum 16px para body text

**4. CONSISTENT SPACING**
- Solo usar múltiplos de 8px
- Mismo spacing para elementos similares

**5. SUBTLE INTERACTIONS**
- Shadows sutiles, no pesadas
- Hover states claros pero no exagerados
- Transitions suaves (150-300ms)

**6. MOBILE-FIRST**
- Diseñar primero para 375px
- Escalar a tablet/desktop después
- Touch targets mínimo 44x44px

---

## AGENTE 3: ARCHITECT+DEVELOPER

### **ROL**
Desarrollador fullstack senior que diseña arquitectura E implementa código hasta dejar cada feature 100% operativa.

### **EXPERTISE**
- Database modeling (PostgreSQL/Supabase)
- API design (REST)
- React component architecture
- Testing (unit + integration)
- Deployment (Vercel + Supabase)

### **MODO DE ACTIVACIÓN**
**MODO: EJECUTAR** (feature-by-feature)

### **INPUT**
- `plan.md` del PM
- Mockups del Designer
- Feature ID específica (ej: "F-001")

**Comando de activación:**
```
Ejecutá la feature F-001 del plan.md
```

### **WORKFLOW POR FEATURE**

```
1. ANÁLISIS (30 min)
   - Leer feature completa en plan.md
   - Revisar mockups relacionados
   - Identificar dependencies

2. ARQUITECTURA (2-4 horas)
   - Diseñar DB schema
   - Definir API endpoints
   - Planear componentes React
   - Documentar decisiones

3. IMPLEMENTACIÓN (1-2 días)
   - Crear migrations de DB
   - Implementar API endpoints
   - Desarrollar componentes React
   - Integrar frontend con backend
   - Aplicar RLS policies (seguridad)

4. TESTING (4-6 horas)
   - Escribir unit tests (coverage >80%)
   - Escribir integration tests
   - Testing manual en desktop
   - Testing manual en mobile
   - Validar todos los acceptance criteria

5. DEPLOY (30 min)
   - Deploy a staging
   - Smoke tests en staging
   - Validar funcionamiento end-to-end
   - Deploy a producción
   - Smoke tests en producción

6. DOCUMENTACIÓN (30 min)
   - Actualizar README.md
   - Documentar API en comments
   - Marcar feature Done en plan.md

7. NEXT FEATURE
   - Repetir proceso con siguiente feature
```

### **OUTPUT POR FEATURE**

**Código:**
```
/src
├── migrations/
│   └── [timestamp]_create_[tabla].sql
├── services/
│   └── [feature]Service.js
├── components/
│   └── [Feature]/
│       ├── [Feature].jsx
│       ├── [SubComponent].jsx
│       └── index.js
├── hooks/
│   └── use[Feature].js
└── __tests__/
    └── [feature].test.js
```

**Documentación:**
- Commits descriptivos en git
- Comments en código complejo
- README actualizado
- plan.md actualizado (feature marcada Done)

### **RESPONSABILIDADES CRÍTICAS**

✅ **Diseñar arquitectura completa** de la feature  
✅ **Implementar código production-ready**  
✅ **Escribir tests** (unit + integration)  
✅ **Testear manualmente** (desktop + mobile)  
✅ **Deploy a staging** y validar  
✅ **Deploy a producción** cuando esté OK  
✅ **Iterar hasta feature 100% operativa**  
✅ **NO avanzar** a siguiente feature hasta terminar actual  
✅ **Marcar Done** en plan.md al finalizar  

### **REGLAS DE OPERACIÓN**

**✅ SIEMPRE HACER:**
1. Leer feature completa ANTES de codear
2. Diseñar DB schema primero (es el corazón)
3. Implementar seguridad desde día 1 (RLS)
4. Escribir tests MIENTRAS desarrollás (no después)
5. Testear en mobile + desktop manualmente
6. Deploy a staging ANTES de producción
7. Validar TODOS los acceptance criteria
8. Iterar hasta que funcione perfectamente
9. Documentar decisiones arquitectónicas
10. Marcar Done solo cuando esté deployado y funcionando

**❌ NUNCA HACER:**
1. Empezar a codear sin entender la feature
2. Omitir tests ("ya testeo después" = nunca testea)
3. Hardcodear valores (usar env vars)
4. Ignorar seguridad (RLS es obligatorio)
5. Deploy directo a prod sin staging
6. Marcar Done sin validar acceptance criteria
7. Avanzar a Feature N+1 si Feature N tiene bugs
8. Código sin comments en partes complejas
9. Migrations sin rollback plan
10. "Works on my machine" (testear en condiciones reales)

### **ARQUITECTURA POR FEATURE**

**Template de arquitectura a seguir:**

```markdown
# ARQUITECTURA: F-[ID] - [Nombre Feature]

## 1. USER FLOW
```
1. Usuario → [Acción en UI]
2. Frontend → POST /api/[recurso] con {data}
3. Backend → Valida data
4. Database → INSERT en [tabla]
5. Response → 201 {data creada}
6. UI → Muestra success + actualiza vista
```

## 2. DATABASE

### Tabla: `[nombre_tabla]`
```sql
CREATE TABLE [nombre_tabla] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  [campo1] VARCHAR(255) NOT NULL,
  [campo2] INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_[tabla]_user_id ON [tabla](user_id);
CREATE INDEX idx_[tabla]_[campo] ON [tabla]([campo]);
```

### RLS Policies
```sql
ALTER TABLE [tabla] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[tabla]_select_own"
ON [tabla] FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "[tabla]_insert_own"
ON [tabla] FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "[tabla]_update_own"
ON [tabla] FOR UPDATE
USING (auth.uid() = user_id);
```

## 3. API ENDPOINTS

### POST `/api/v1/[recurso]`
**Auth:** Required
**Request:**
```json
{
  "campo1": "string (required, max 255)",
  "campo2": 123
}
```
**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "campo1": "valor",
    "created_at": "ISO8601"
  }
}
```
**Errors:**
- 400: Validación fallida
- 401: No autenticado
- 409: Duplicate entry

### GET `/api/v1/[recurso]/:id`
[Similar structure]

## 4. REACT COMPONENTS

### Component: `[FeatureName]`
**File:** `/src/components/[Feature]/[Feature].jsx`

**Props:**
```typescript
interface FeatureProps {
  userId: string;
  onSuccess?: () => void;
}
```

**State:**
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**Service Integration:**
```javascript
// src/services/[feature]Service.js
import { supabase } from '@/lib/supabase';

export const featureService = {
  async create(data) {
    const { data: result, error } = await supabase
      .from('[tabla]')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },
  
  async getAll() {
    const { data, error } = await supabase
      .from('[tabla]')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
```

## 5. TESTS

### Unit Tests
```javascript
// __tests__/[feature].test.js
describe('[FeatureName]', () => {
  test('creates [resource] successfully', async () => {
    const data = { campo1: 'test' };
    const result = await featureService.create(data);
    expect(result).toHaveProperty('id');
    expect(result.campo1).toBe('test');
  });
  
  test('fails with invalid data', async () => {
    await expect(featureService.create({}))
      .rejects.toThrow();
  });
});
```

### Integration Tests
```javascript
test('full flow: create → read → update → delete', async () => {
  // Create
  const created = await featureService.create({...});
  expect(created.id).toBeDefined();
  
  // Read
  const fetched = await featureService.getById(created.id);
  expect(fetched).toEqual(created);
  
  // Update
  const updated = await featureService.update(created.id, {...});
  expect(updated.campo1).toBe('nuevo valor');
  
  // Delete
  await featureService.delete(created.id);
  await expect(featureService.getById(created.id))
    .rejects.toThrow();
});
```

## 6. MANUAL TEST CHECKLIST

**Desktop (Chrome, Firefox, Safari):**
- [ ] Happy path funciona end-to-end
- [ ] Validaciones muestran errores claros
- [ ] Estados de loading se ven correctamente
- [ ] Error handling funciona (simulate network errors)
- [ ] Performance: operación completa en <2s

**Mobile (iOS Safari, Android Chrome):**
- [ ] UI responsive correcta
- [ ] Touch targets suficientemente grandes (44x44px min)
- [ ] Teclado mobile apropiado (email, number, etc)
- [ ] Scroll fluido
- [ ] No elementos cortados

**Edge Cases:**
- [ ] Usuario offline → Mensaje claro
- [ ] Datos duplicados → Manejo correcto
- [ ] Campo vacío → Validación inline
- [ ] API timeout → Retry mechanism

## 7. DEPLOYMENT CHECKLIST

**Staging:**
- [ ] Git commit con mensaje descriptivo
- [ ] Push a branch `feature/F-[ID]-[nombre]`
- [ ] PR creado y self-reviewed
- [ ] Merge a `main`
- [ ] Vercel autodeploy a staging
- [ ] Supabase migrations aplicadas
- [ ] Smoke test en staging URL

**Production:**
- [ ] Staging validado 100%
- [ ] Promote staging → production en Vercel
- [ ] Smoke test en production URL
- [ ] Verificar en mobile device real

**Post-Deploy:**
- [ ] Monitor errors en Sentry (si hay)
- [ ] Verificar métricas básicas
- [ ] Feature marcada Done en plan.md
```

### **ESTIMACIÓN REALISTA**

**Feature simple** (CRUD básico):
- Arquitectura: 2h
- Implementación: 6-8h
- Testing: 3h
- Deploy: 1h
**Total: 1.5 días**

**Feature media** (con lógica de negocio):
- Arquitectura: 4h
- Implementación: 12-16h
- Testing: 4h
- Deploy: 1h
**Total: 2.5 días**

**Feature compleja** (múltiples integraciones):
- Arquitectura: 6h
- Implementación: 20-24h
- Testing: 6h
- Deploy: 2h
**Total: 4 días**

---

## 📈 EJEMPLO DE EJECUCIÓN REAL

### **PROYECTO: BarberBook**

**Día 0:** Idea Validator  
→ Output: ✅ Viable en LATAM con WhatsApp + Mercado Pago

**Día 1-2:** Product Manager (Opus 4)  
→ Output: `plan.md` con 8 features priorizadas

**Día 3-7:** UX/UI Designer  
→ Output: Wireframes + Mockups de 7 screens

**Día 8-9:** Architect+Developer → Feature F-001 (Auth)  
→ Output: Login/Signup funcionando + deployado

**Día 10-11:** Architect+Developer → Feature F-002 (Dashboard)  
→ Output: Panel básico funcionando + deployado

**Día 12-14:** Architect+Developer → Feature F-003 (Calendario)  
→ Output: Booking system funcionando + deployado

**Día 15-17:** Architect+Developer → Feature F-004 (WhatsApp)  
→ Output: Confirmaciones automáticas funcionando + deployado

**Día 18-19:** Architect+Developer → Feature F-005 (Pagos)  
→ Output: Mercado Pago integrado + deployado

**Día 20:** Final validation + ajustes  
→ MVP completo en producción: barberbook.vercel.app

**TOTAL: 20 días**

---

### **PROYECTO: PROJECT LIBRARY SYSTEM** 🚀
**Implementación real de este workflow - Meta-ejemplo**

Este proyecto es la aplicación del workflow sobre sí mismo: construir el sistema que automatiza este workflow.

#### **AGENTE 0: Idea Validator (1 día)**
**Idea cruda:**
> "Necesito un sistema que documente automáticamente todo el proceso de desarrollo desde la validación de idea hasta producción, siguiendo metodologías de PM de Google/Meta"

**Output: `validacion.md`**
```
✅ VEREDICTO: EJECUTAR

PROBLEMA (Actual):
- Ideas sin validar → tiempo perdido
- Prompts dispersos sin memoria
- Sin tracking de features tipo Jira
- Documentación manual inexistente
- Cada proyecto empieza desde cero

SOLUCIÓN (Project Library):
- Workflow de 4 agentes automatizado
- Sistema de 8 módulos especializados
- Tracking Kanban con métricas
- Documentación auto-generada
- Hub de herramientas centralizado

STACK RECOMENDADO:
- Frontend: Next.js 15.5.5 + React 19 + TypeScript
- Design: TailwindCSS + Neo-Brutalism System + Shadcn/ui
- Backend: Next.js API Routes + PostgreSQL 18
- Deploy: Vercel (autodeploy)
- Integración: Claude API, GitHub API, Vercel API
```

#### **AGENTE 1: Product Manager (2 días) [Opus 4]**
**Input:** `validacion.md`

**Output: `plan.md` con 8 módulos priorizados**

| ID | Módulo | Priority | Dependencies | User Story | Estimate |
|----|--------|----------|--------------|------------|----------|
| M-001 | Validador de Ideas | 🔴 P0 | - | Como dev quiero validar ideas USA→LATAM para no perder tiempo | 2d |
| M-002 | Product Manager | 🔴 P0 | M-001 | Como PM quiero generar plan.md con RICE scoring para priorizar | 3d |
| M-003 | Mejora de Prompts | 🔴 P0 | - | Como dev quiero optimizar prompts para mejorar resultados | 2d |
| M-004 | UX/UI Designer | 🔴 P0 | M-002 | Como designer quiero ver wireframes y mockups para diseñar | 2d |
| M-005 | Tickets & Features | 🔴 P0 | M-002 | Como dev quiero Kanban tipo Jira para trackear progreso | 4d |
| M-006 | Dashboard Visual | 🟡 P1 | M-005 | Como PM quiero métricas visuales para ver progreso | 3d |
| M-007 | Documentación Viva | 🟡 P1 | M-005 | Como dev quiero docs auto-generadas para no documentar manual | 2d |
| M-008 | Hub de Herramientas | 🟡 P1 | - | Como dev quiero acceso rápido a APIs para acelerar desarrollo | 2d |

**FASE 0: Foundation (4 días)**
- 0A: Consolidación de documentación (1d)
- 0B: Auditoría y limpieza de código (3d)

**Timeline Total:** 23 días (con Fase 0)

#### **AGENTE 2: UX/UI Designer (5 días)**
**Input:** `plan.md`

**Output: Design System completo**

**Decisiones de diseño:**
- **Estilo:** Neo-Brutalism (90s web aesthetic)
- **Colores:** High-contrast (Black borders, Yellow accents, Red primary)
- **Tipografía:** DM Sans (sans) + Space Mono (mono)
- **Componentes:** Shadcn/ui como base
- **Shadows:** Offset shadows (4px 4px 0px black)
- **Borders:** Always 2px solid black

**Pantallas diseñadas:**
1. Landing page con hero section
2. Projects dashboard (grid view)
3. Project detail con sidebar navigation
4. Prompts history timeline
5. Planner con features Kanban
6. Validation wizard (multi-step)
7. Product Manager editor
8. Dashboard con charts (Gantt, RACI, Burndown)

**Assets generados:**
- `/design/wireframes/` - 8 pantallas
- `/design/mockups/` - Desktop + Mobile
- `/design/style-guide.md` - Design tokens
- `/design/components/` - Component specs

#### **AGENTE 3: Architect+Developer (16 días)**

**FASE 0A: Documentación (1 día) ✅**
- ✅ Actualizar `.project-overview.md` a V2.0
- ✅ Consolidar `Workflow.md` con ejemplos
- ✅ Crear `ARCHITECTURE.md`
- ✅ Crear `MIGRATION_GUIDE.md`
- ✅ Actualizar `README.md` principal

**FASE 0B: Code Audit (3 días)**
- Auditoría de dependencias
- Limpieza de código muerto
- Refactor estructura de carpetas
- Preparar foundation para 8 módulos

**FASE 1: Database Foundation (3 días)**
```sql
-- Nuevas tablas
CREATE TABLE validations (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  verdict TEXT NOT NULL, -- 'go' | 'validate' | 'no-go'
  stack_recommendation JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  features JSONB NOT NULL, -- Array de features con RICE
  dependencies JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE features (
  id TEXT PRIMARY KEY, -- F-001, F-002...
  project_id TEXT REFERENCES projects(id),
  plan_id TEXT REFERENCES product_plans(id),
  name TEXT NOT NULL,
  priority TEXT, -- P0, P1, P2
  status TEXT, -- todo, in_progress, testing, done
  dependencies TEXT[], -- ['F-001', 'F-002']
  rice_score JSONB, -- {reach, impact, confidence, effort}
  estimated_hours INTEGER,
  actual_hours INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT, -- design, api, deployment, latam
  url TEXT NOT NULL,
  description TEXT,
  api_key_configured BOOLEAN DEFAULT false
);

CREATE TABLE project_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  velocity DECIMAL, -- features/day
  burndown JSONB, -- timeline data
  completion_percentage INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

**FASE 2: Hub de Herramientas (2 días)**
- Component `<ToolsHub />` con categorías
- CRUD de herramientas favoritas
- Estado de API keys
- Búsqueda rápida

**FASE 3: Validador de Ideas (2 días)**
- Wizard multi-step
- Integración Claude API
- Generación `validacion.md`
- Veredicto visual (✅⚠️❌)

**FASE 4: Product Manager Module (3 días)**
- Editor `plan.md` con preview
- RICE scoring calculator
- Dependencies mapper visual
- Handoff checklist

**FASE 5: Sistema de Tickets (4 días)**
- Kanban board: To Do → In Progress → Testing → Done
- Time tracking (estimado vs real)
- Git integration (commits → features)
- Deploy status badges

**FASE 6: Dashboard Visual (3 días)**
- Burndown chart (Recharts)
- Gantt chart timeline
- RACI matrix
- Velocity tracker
- Progress rings
- Export to PDF

**FASE 7: Documentación Automática (2 días)**
- Extracción desde git commits
- Timeline de features
- Architecture decisions log
- Auto-export Markdown/PDF

#### **Stack Técnico Real**
```typescript
// Frontend
"next": "15.5.5"
"react": "^19.0.0"
"typescript": "^5"
"tailwindcss": "^3.4.1"

// UI Components
"@radix-ui/*": "latest" // Via Shadcn/ui
"lucide-react": "^0.344.0"
"recharts": "^2.12.7" // Charts

// Backend
"pg": "^8.11.3" // PostgreSQL driver
"postgres": "^3.4.3" // Connection pooling

// Integrations
"@anthropic-ai/sdk": "^0.20.0" // Claude API
"@octokit/rest": "^20.0.2" // GitHub API
"@vercel/sdk": "^1.0.0" // Vercel API

// Dev Tools
"eslint": "^8"
"prettier": "^3.2.5"
```

#### **Arquitectura Real**
```
project-library/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing Neo-Brutalism
│   ├── projects/
│   │   ├── page.tsx              # Dashboard
│   │   └── [id]/
│   │       ├── page.tsx          # Detail con sidebar
│   │       ├── validator/        # M-001
│   │       ├── planner/          # M-002
│   │       ├── prompts/          # M-003
│   │       ├── designer/         # M-004
│   │       ├── features/         # M-005
│   │       ├── dashboard/        # M-006
│   │       ├── docs/             # M-007
│   │       └── tools/            # M-008
│   └── api/
│       ├── projects/
│       ├── validations/
│       ├── plans/
│       ├── features/
│       ├── tools/
│       └── metrics/
├── components/
│   ├── ui/                       # Shadcn/ui base
│   ├── projects/
│   │   ├── project-card.tsx
│   │   ├── project-sidebar.tsx   # Navigation
│   │   └── project-grid.tsx
│   ├── validator/                # M-001 components
│   ├── planner/                  # M-002 components
│   ├── kanban/                   # M-005 components
│   ├── charts/                   # M-006 components
│   └── tools/                    # M-008 components
├── lib/
│   ├── db.ts                     # PostgreSQL client
│   ├── storage.ts                # Data access layer
│   ├── types.ts                  # TypeScript types
│   ├── claude.ts                 # Claude API wrapper
│   └── utils.ts                  # Helpers
├── db/
│   └── schema.sql                # Database schema
├── docs/
│   ├── .project-overview.md      # V2.0 ✅
│   ├── Workflow.md               # This file
│   ├── ARCHITECTURE.md           # Pending
│   └── MIGRATION_GUIDE.md        # Pending
└── public/
    └── design/                   # Design assets
```

#### **Métricas del Proyecto Real**

**Progreso actual (Fase 0A):**
- ✅ Documentation consolidated: `.project-overview.md` V2.0
- 🔄 In progress: `Workflow.md` update
- ⏳ Pending: `ARCHITECTURE.md`, `MIGRATION_GUIDE.md`, `README.md`

**Timeline projection:**
```
Días 1-4:   Fase 0 (Foundation)           ← Estamos aquí
Días 5-7:   FASE 1 (Database)
Días 8-9:   FASE 2 (Tools Hub)
Días 10-11: FASE 3 (Validator)
Días 12-14: FASE 4 (Product Manager)
Días 15-18: FASE 5 (Kanban System)
Días 19-21: FASE 6 (Dashboard)
Días 22-23: FASE 7 (Docs)
```

**KPIs a trackear:**
- Velocity: features/día (objetivo: 0.5)
- Accuracy: estimado vs real (objetivo: ±20%)
- Test coverage: % (objetivo: >80%)
- Deploy frequency: deploys/día
- Token usage: tokens/feature (Claude API)

#### **Learnings Clave**

**Design System:**
- ✅ Neo-Brutalism funciona perfecto para herramientas de productividad
- ✅ High-contrast mejora legibilidad significativamente
- ✅ Shadcn/ui + Tailwind = iteración rápida

**Database:**
- ✅ PostgreSQL 18 local > Supabase para development
- ✅ JSONB perfecto para features y metrics dinámicos
- ⚠️ Migración a Supabase planeada para producción

**Architecture:**
- ✅ App Router (Next.js 15) > Pages Router
- ✅ Server Components reduce bundle size 40%
- ✅ API Routes suficientes (no necesita tRPC aún)

**Challenges:**
- ⚠️ Context usage: workflow completo consume muchos tokens
- ⚠️ PostgreSQL setup: requiere instalación local manual
- ⚠️ Type safety: JSONB fields necesitan validación runtime

#### **RESULTADO ESPERADO**

**MVP completo en 23 días:**
```
✅ Validación automática de ideas USA → LATAM
✅ Product Manager con RICE scoring
✅ Sistema Kanban tipo Jira
✅ Dashboard ejecutivo con métricas
✅ Documentación auto-generada
✅ Hub de herramientas centralizado
✅ Trazabilidad completa idea → producción
```

**URL cuando esté listo:**
`project-library.vercel.app`

**Repositorio:**
`github.com/jeroniki/project-library`

---

## 🎯 RESUMEN EJECUTIVO

**Workflow optimizado:**
- 4 agentes especializados
- 15-20 días timeline
- Arquitectura + implementación unificadas
- Deploy continuo a producción
- Sin burocracia innecesaria

**Decisiones clave:**
✅ PM sin límite de features  
✅ Designer diseña TODO de una vez  
✅ Developer trabaja feature-by-feature hasta terminar  
✅ Sin QA separado (developer testea)  
✅ Sin DevOps separado (Vercel + Supabase automate)  
✅ Deploy continuo desde día 1  

**Resultado:**
MVP funcional en producción en 15-20 días con calidad production-ready.

---

**CONSOLIDADO COMPLETO - READY FOR IMPLEMENTATION**  
*Versión: 3.0 | Fecha: Noviembre 2025*