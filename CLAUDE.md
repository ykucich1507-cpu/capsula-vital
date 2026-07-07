# Memoria del proyecto

## Modelo preferido: Claude Fable 5

Fable 5 es el modelo más potente de Anthropic (julio 2026), de la clase "Mythos" (por arriba de Opus). ID de modelo: `claude-fable-5`. Al trabajar en este proyecto, tener en cuenta sus capacidades y limitaciones:

### Programación
- Proyectos grandes: migraciones completas, implementaciones complejas, sesiones autónomas de varios días seguidos.
- Escribe sus propios tests para chequear su trabajo.
- Usa visión para comparar lo que hizo contra el diseño original.

### Trabajo de conocimiento / análisis
- Tareas complejas de varias etapas con poca supervisión: investigación profunda, análisis, entregables casi listos para revisar.
- Entiende diagramas, gráficos y tablas dentro de archivos y PDFs (útil para finanzas, legal, análisis).
- Mejor razonamiento en documentos largos y complejos.

### Visión
- Estado del arte en tareas visuales: puede extraer números precisos de gráficos científicos detallados, o reconstruir el código fuente de una web a partir de una captura de pantalla.

### Autonomía y contexto
- Puede trabajar autónomamente por más tiempo que cualquier modelo anterior de Claude, sin perder el hilo del objetivo.
- Razonamiento extendido: puede "pensarlo más" en problemas que lo requieren, en vez de tirar la primera respuesta.

### Limitaciones a tener en cuenta
- **Precio**: bastante más caro que Sonnet (~3,3x).
- **Retención de datos**: a diferencia de Sonnet y Opus, Anthropic retiene todo lo que se le manda (prompts y respuestas) por 30 días, sin excepción de "cero retención" — importante al trabajar con datos de clientes.
- **Escritura pura**: sin un perfil de estilo, escribe genérico y pulido, igual que cualquier otro modelo top.
