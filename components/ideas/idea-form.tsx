'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, Target, Wrench, Plus, X, Save, Star } from 'lucide-react';
import { Idea, IdeaIntegration, IdeaSkill } from '@/lib/types';
import { ideaSchema } from '@/lib/idea-schemas';
import { nanoid } from 'nanoid';

interface IdeaFormProps {
  idea?: Idea; // If editing existing idea
  onSave: (idea: Idea) => void | Promise<void>;
  onCancel?: () => void;
  autoSave?: boolean; // Enable auto-save functionality
}

const URGENCIA_OPTIONS = [
  { value: 'baja', label: 'Baja', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'media', label: 'Media', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'crítica', label: 'Crítica', color: 'bg-red-100 text-red-700 border-red-300' },
];

const COMPLEJIDAD_LABELS = [
  { value: 1, label: 'Muy Baja', emoji: '😊' },
  { value: 2, label: 'Baja', emoji: '🙂' },
  { value: 3, label: 'Media', emoji: '😐' },
  { value: 4, label: 'Alta', emoji: '😰' },
  { value: 5, label: 'Muy Alta', emoji: '😱' },
];

const CATEGORIAS = [
  'saas', 'marketplace', 'fintech', 'health', 'education',
  'social', 'productivity', 'entertainment', 'ecommerce', 'other'
];

export function IdeaForm({ idea, onSave, onCancel, autoSave = true }: IdeaFormProps) {
  // ================================================
  // ID & Metadata
  // ================================================
  const [id, setId] = useState(idea?.id || '');
  const [favorita, setFavorita] = useState(idea?.favorita || false);
  const [categoria, setCategoria] = useState(idea?.categoria || '');
  const [tags, setTags] = useState<string[]>(idea?.tags || []);
  const [notas, setNotas] = useState(idea?.notas || '');

  // ================================================
  // DEMANDA (Problema → Mercado)
  // ================================================
  const [problema, setProblema] = useState(idea?.problema || '');
  const [mercadoObjetivo, setMercadoObjetivo] = useState(idea?.mercadoObjetivo || '');
  const [urgencia, setUrgencia] = useState<'baja' | 'media' | 'alta' | 'crítica'>(idea?.urgencia || 'media');
  const [tamañoMercado, setTamañoMercado] = useState(idea?.tamañoMercado || '');
  const [evidenciaDemanda, setEvidenciaDemanda] = useState(idea?.evidenciaDemanda || '');

  // ================================================
  // OFERTA (Solución → Herramientas)
  // ================================================
  const [solucion, setSolucion] = useState(idea?.solucion || '');
  const [herramientasDisponibles, setHerramientasDisponibles] = useState<string[]>(
    idea?.herramientasDisponibles || []
  );
  const [integracionesNecesarias, setIntegracionesNecesarias] = useState<IdeaIntegration[]>(
    idea?.integracionesNecesarias || []
  );
  const [informacionRequerida, setInformacionRequerida] = useState<string[]>(
    idea?.informacionRequerida || []
  );

  // ================================================
  // ANÁLISIS TÉCNICO
  // ================================================
  const [complejidadTecnica, setComplejidadTecnica] = useState<1 | 2 | 3 | 4 | 5>(
    idea?.complejidadTecnica || 3
  );
  const [skillsRequeridos, setSkillsRequeridos] = useState<IdeaSkill[]>(
    idea?.skillsRequeridos || []
  );
  const [tiempoEstimado, setTiempoEstimado] = useState({
    diseño: idea?.tiempoEstimado?.diseño || 0,
    desarrollo: idea?.tiempoEstimado?.desarrollo || 0,
    testing: idea?.tiempoEstimado?.testing || 0,
  });
  const [bloqueadores, setBloqueadores] = useState<string[]>(idea?.bloqueadores || []);

  // ================================================
  // UI State
  // ================================================
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('demanda');

  // ================================================
  // Array Helpers
  // ================================================
  const addToArray = (arr: string[], setArr: (val: string[]) => void) => {
    setArr([...arr, '']);
  };

  const removeFromArray = (arr: string[], setArr: (val: string[]) => void, index: number) => {
    setArr(arr.filter((_, i) => i !== index));
  };

  const updateArrayItem = (arr: string[], setArr: (val: string[]) => void, index: number, value: string) => {
    const newArr = [...arr];
    newArr[index] = value;
    setArr(newArr);
  };

  // ================================================
  // Integration Helpers
  // ================================================
  const addIntegration = () => {
    setIntegracionesNecesarias([
      ...integracionesNecesarias,
      { nombre: '', api: '', documentacion: '', complejidad: 'media' }
    ]);
  };

  const removeIntegration = (index: number) => {
    setIntegracionesNecesarias(integracionesNecesarias.filter((_, i) => i !== index));
  };

  const updateIntegration = (index: number, field: keyof IdeaIntegration, value: any) => {
    const newIntegrations = [...integracionesNecesarias];
    newIntegrations[index] = { ...newIntegrations[index], [field]: value };
    setIntegracionesNecesarias(newIntegrations);
  };

  // ================================================
  // Skill Helpers
  // ================================================
  const addSkill = () => {
    setSkillsRequeridos([
      ...skillsRequeridos,
      { skill: '', nivelNecesario: 'mid', tenemos: false }
    ]);
  };

  const removeSkill = (index: number) => {
    setSkillsRequeridos(skillsRequeridos.filter((_, i) => i !== index));
  };

  const updateSkill = (index: number, field: keyof IdeaSkill, value: any) => {
    const newSkills = [...skillsRequeridos];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkillsRequeridos(newSkills);
  };

  // ================================================
  // Auto-save Effect
  // ================================================
  useEffect(() => {
    if (!autoSave || !id) return;

    const timeoutId = setTimeout(() => {
      handleAutoSave();
    }, 2000); // Save 2 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [
    problema, mercadoObjetivo, urgencia, solucion, complejidadTecnica,
    favorita, categoria, notas
  ]);

  const handleAutoSave = async () => {
    if (!id || loading) return;

    const ideaData = buildIdeaObject();
    const validation = ideaSchema.safeParse(ideaData);

    if (validation.success) {
      setSaving(true);
      try {
        await onSave(validation.data);
      } catch (err) {
        // Silent fail for auto-save
      } finally {
        setSaving(false);
      }
    }
  };

  // ================================================
  // Form Submission
  // ================================================
  const buildIdeaObject = (): Idea => {
    return {
      id,
      problema,
      mercadoObjetivo,
      urgencia,
      tamañoMercado,
      evidenciaDemanda,
      solucion,
      herramientasDisponibles: herramientasDisponibles.filter(h => h.trim()),
      integracionesNecesarias: integracionesNecesarias.filter(i => i.nombre.trim()),
      informacionRequerida: informacionRequerida.filter(i => i.trim()),
      complejidadTecnica,
      skillsRequeridos: skillsRequeridos.filter(s => s.skill.trim()),
      tiempoEstimado: tiempoEstimado.diseño || tiempoEstimado.desarrollo || tiempoEstimado.testing
        ? tiempoEstimado
        : undefined,
      bloqueadores: bloqueadores.filter(b => b.trim()),
      tags: tags.filter(t => t.trim()),
      categoria,
      notas,
      favorita,
      createdAt: idea?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate ID if creating new
    const finalId = id || `IDEA-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    setId(finalId);

    const ideaData = { ...buildIdeaObject(), id: finalId };

    // Validate
    const validation = ideaSchema.safeParse(ideaData);

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      setError(`${firstError.path.join('.')}: ${firstError.message}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(validation.data);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la idea');
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // RENDER
  // ================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                <CardTitle className="text-2xl font-black">
                  {idea ? 'Editar Idea' : 'Nueva Idea'}
                </CardTitle>
                {saving && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Guardando...
                  </Badge>
                )}
              </div>
              <CardDescription>
                Completa los 3 pilares: DEMANDA, OFERTA y ANÁLISIS TÉCNICO
              </CardDescription>
            </div>
            <Button
              type="button"
              variant={favorita ? "default" : "outline"}
              size="icon"
              onClick={() => setFavorita(!favorita)}
              className={favorita ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              <Star className={`h-4 w-4 ${favorita ? 'fill-white' : ''}`} />
            </Button>
          </div>

          {/* ID & Category */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label>ID de la Idea</Label>
              <Input
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                placeholder="IDEA-001"
                className="border-2 border-black font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 border-4 border-black">
          <TabsTrigger value="demanda" className="font-bold">
            <Target className="h-4 w-4 mr-2" />
            DEMANDA
          </TabsTrigger>
          <TabsTrigger value="oferta" className="font-bold">
            <Lightbulb className="h-4 w-4 mr-2" />
            OFERTA
          </TabsTrigger>
          <TabsTrigger value="tecnico" className="font-bold">
            <Wrench className="h-4 w-4 mr-2" />
            TÉCNICO
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DEMANDA */}
        <TabsContent value="demanda" className="space-y-4">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="font-black">Problema → Mercado</CardTitle>
              <CardDescription>¿Qué problema resuelve y para quién?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-bold">Problema *</Label>
                <Textarea
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  placeholder="Describe el problema que vas a resolver..."
                  className="min-h-[100px] border-2 border-black"
                  required
                />
                <p className="text-xs text-gray-500">{problema.length} / 1000 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">Mercado Objetivo *</Label>
                <Textarea
                  value={mercadoObjetivo}
                  onChange={(e) => setMercadoObjetivo(e.target.value)}
                  placeholder="¿Quiénes son tus usuarios? (demografía, ubicación, tamaño)"
                  className="min-h-[80px] border-2 border-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold">Urgencia *</Label>
                <Select value={urgencia} onValueChange={(val: any) => setUrgencia(val)}>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCIA_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <Badge variant="outline" className={opt.color}>
                          {opt.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tamaño de Mercado (Opcional)</Label>
                <Input
                  value={tamañoMercado}
                  onChange={(e) => setTamañoMercado(e.target.value)}
                  placeholder="Ej: TAM $10M ARR, 250k usuarios potenciales"
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label>Evidencia de Demanda (Opcional)</Label>
                <Textarea
                  value={evidenciaDemanda}
                  onChange={(e) => setEvidenciaDemanda(e.target.value)}
                  placeholder="Encuestas, competidores exitosos, estadísticas..."
                  className="min-h-[80px] border-2 border-black"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: OFERTA */}
        <TabsContent value="oferta" className="space-y-4">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="font-black">Solución → Herramientas</CardTitle>
              <CardDescription>¿Cómo vas a resolver el problema?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-bold">Solución *</Label>
                <Textarea
                  value={solucion}
                  onChange={(e) => setSolucion(e.target.value)}
                  placeholder="Describe tu solución propuesta..."
                  className="min-h-[100px] border-2 border-black"
                  required
                />
              </div>

              {/* Herramientas Disponibles */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Herramientas Disponibles</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addToArray(herramientasDisponibles, setHerramientasDisponibles)}
                    className="border-2 border-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {herramientasDisponibles.map((herr, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={herr}
                      onChange={(e) => updateArrayItem(herramientasDisponibles, setHerramientasDisponibles, idx, e.target.value)}
                      placeholder="Next.js, Supabase, Stripe..."
                      className="border-2 border-black"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeFromArray(herramientasDisponibles, setHerramientasDisponibles, idx)}
                      className="border-2 border-black"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Integraciones Necesarias */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Integraciones Necesarias (APIs)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addIntegration}
                    className="border-2 border-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {integracionesNecesarias.map((int, idx) => (
                  <Card key={idx} className="p-4 border-2 border-black">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="font-bold">Integración #{idx + 1}</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeIntegration(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={int.nombre}
                        onChange={(e) => updateIntegration(idx, 'nombre', e.target.value)}
                        placeholder="Nombre (ej: WhatsApp Business API)"
                        className="border-2 border-black"
                      />
                      <Input
                        value={int.api}
                        onChange={(e) => updateIntegration(idx, 'api', e.target.value)}
                        placeholder="URL de la API"
                        className="border-2 border-black"
                      />
                      <Input
                        value={int.documentacion}
                        onChange={(e) => updateIntegration(idx, 'documentacion', e.target.value)}
                        placeholder="URL de documentación"
                        className="border-2 border-black"
                      />
                      <Select
                        value={int.complejidad}
                        onValueChange={(val: any) => updateIntegration(idx, 'complejidad', val)}
                      >
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baja">Baja</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Información Requerida */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Información Requerida del Usuario</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addToArray(informacionRequerida, setInformacionRequerida)}
                    className="border-2 border-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {informacionRequerida.map((info, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={info}
                      onChange={(e) => updateArrayItem(informacionRequerida, setInformacionRequerida, idx, e.target.value)}
                      placeholder="Ej: Horarios disponibles, servicios, precios..."
                      className="border-2 border-black"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeFromArray(informacionRequerida, setInformacionRequerida, idx)}
                      className="border-2 border-black"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: TÉCNICO */}
        <TabsContent value="tecnico" className="space-y-4">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <CardTitle className="font-black">Análisis Técnico</CardTitle>
              <CardDescription>Complejidad, skills y tiempo estimado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Complejidad Técnica */}
              <div className="space-y-2">
                <Label className="text-base font-bold">Complejidad Técnica * (1-5)</Label>
                <div className="grid grid-cols-5 gap-2">
                  {COMPLEJIDAD_LABELS.map((comp) => (
                    <Button
                      key={comp.value}
                      type="button"
                      variant={complejidadTecnica === comp.value ? "default" : "outline"}
                      onClick={() => setComplejidadTecnica(comp.value as 1 | 2 | 3 | 4 | 5)}
                      className="h-20 flex flex-col items-center justify-center border-2 border-black"
                    >
                      <span className="text-2xl">{comp.emoji}</span>
                      <span className="text-xs font-bold">{comp.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Skills Requeridos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Skills Requeridos</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addSkill}
                    className="border-2 border-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {skillsRequeridos.map((skill, idx) => (
                  <Card key={idx} className="p-4 border-2 border-black">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="font-bold">Skill #{idx + 1}</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSkill(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={skill.skill}
                        onChange={(e) => updateSkill(idx, 'skill', e.target.value)}
                        placeholder="Ej: React, PostgreSQL, Stripe Connect..."
                        className="border-2 border-black"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={skill.nivelNecesario}
                          onValueChange={(val: any) => updateSkill(idx, 'nivelNecesario', val)}
                        >
                          <SelectTrigger className="border-2 border-black">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="junior">Junior</SelectItem>
                            <SelectItem value="mid">Mid</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant={skill.tenemos ? "default" : "outline"}
                          onClick={() => updateSkill(idx, 'tenemos', !skill.tenemos)}
                          className="border-2 border-black"
                        >
                          {skill.tenemos ? '✓ Lo tenemos' : '✗ No lo tenemos'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Tiempo Estimado */}
              <div className="space-y-2">
                <Label className="text-base font-bold">Tiempo Estimado (semanas)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm">Diseño</Label>
                    <Input
                      type="number"
                      value={tiempoEstimado.diseño}
                      onChange={(e) => setTiempoEstimado({ ...tiempoEstimado, diseño: Number(e.target.value) })}
                      className="border-2 border-black"
                      min="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Desarrollo</Label>
                    <Input
                      type="number"
                      value={tiempoEstimado.desarrollo}
                      onChange={(e) => setTiempoEstimado({ ...tiempoEstimado, desarrollo: Number(e.target.value) })}
                      className="border-2 border-black"
                      min="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">Testing</Label>
                    <Input
                      type="number"
                      value={tiempoEstimado.testing}
                      onChange={(e) => setTiempoEstimado({ ...tiempoEstimado, testing: Number(e.target.value) })}
                      className="border-2 border-black"
                      min="0"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Total: {tiempoEstimado.diseño + tiempoEstimado.desarrollo + tiempoEstimado.testing} semanas
                </p>
              </div>

              {/* Bloqueadores */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Bloqueadores / Riesgos</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addToArray(bloqueadores, setBloqueadores)}
                    className="border-2 border-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                {bloqueadores.map((bloq, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={bloq}
                      onChange={(e) => updateArrayItem(bloqueadores, setBloqueadores, idx, e.target.value)}
                      placeholder="Ej: Rate limits de API, necesita verificación de negocio..."
                      className="border-2 border-black"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeFromArray(bloqueadores, setBloqueadores, idx)}
                      className="border-2 border-black"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notas finales */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader>
          <CardTitle className="font-black">Notas Adicionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Cualquier otra información relevante..."
            className="min-h-[100px] border-2 border-black"
          />

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (separados por Enter)</Label>
            <Input
              placeholder="fintech, saas, mobile..."
              className="border-2 border-black"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const value = input.value.trim();
                  if (value && !tags.includes(value)) {
                    setTags([...tags, value]);
                    input.value = '';
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-2 border-black"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-4 border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 font-bold">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all font-black text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {idea ? 'Actualizar Idea' : 'Crear Idea'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
