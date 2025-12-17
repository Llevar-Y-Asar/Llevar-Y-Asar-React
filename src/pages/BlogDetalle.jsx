import { useParams, useNavigate } from 'react-router-dom';

export function BlogDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const recetas = {
        1: {
            id: 1,
            titulo: "Receta Chilena de Anticuchos",
            imagen: "/src/assets/image/blog1.jpg",
            contenido: `
                <h3>Ingredientes</h3>
                <ul>
                    <li>500g de carne de res (preferiblemente entraña)</li>
                    <li>4 longanizas</li>
                    <li>2 cebollas medianas</li>
                    <li>2 cucharadas de pimentón</li>
                    <li>Sal y pimienta al gusto</li>
                    <li>Ají verde picado</li>
                    <li>Vinagre blanco</li>
                </ul>

                <h3>Preparación</h3>
                <ol>
                    <li>Corta la carne en cubos de 3x3 cm y las cebollas en gajos</li>
                    <li>Ensarta en palitos alternando carne, longaniza y cebolla</li>
                    <li>Mezcla pimentón, sal, pimienta y ají verde en un mortero</li>
                    <li>Pinta los anticuchos con la mezcla y deja marinar 30 minutos</li>
                    <li>Asa a fuego medio-alto durante 10-12 minutos, girando constantemente</li>
                </ol>

                <h3>Consejo de Chef</h3>
                <p>Los anticuchos chilenos son más que una receta, son una tradición. El secreto está en no apurar el asado y en mantener la carne jugosa. Sirve con pan tostado y salsa criolla para la experiencia completa.</p>
            `
        },
        2: {
            id: 2,
            titulo: "Asado + Chorizos: La Combinación Perfecta",
            imagen: "/src/assets/image/blog2.jpg",
            contenido: `
                <h3>Ingredientes</h3>
                <ul>
                    <li>1 kg de asado de tira</li>
                    <li>6 chorizos artesanales</li>
                    <li>2 cebollas grandes</li>
                    <li>4 tomates</li>
                    <li>Ensalada fresca (lechuga, tomate, cebolla)</li>
                    <li>Pan tostado</li>
                    <li>Sal y pimienta</li>
                </ul>

                <h3>Preparación de la Parrillada</h3>
                <ol>
                    <li>Coloca el asado de tira en la parrilla a fuego medio</li>
                    <li>Cocina 20-25 minutos por lado hasta obtener costra dorada</li>
                    <li>Los últimos 15 minutos agrega los chorizos</li>
                    <li>Mientras se asa, prepara la ensalada con cebolla picada fina</li>
                    <li>Tuesta el pan directamente en la parrilla los últimos minutos</li>
                </ol>

                <h3>Presentación</h3>
                <p>Sirve el asado y chorizos sobre el pan tostado con ensalada al lado. La combinación de la carne jugosa del asado con la sabrosa del chorizo es insuperable. ¡Perfecto para una reunión familiar!</p>
            `
        },
        7: {
            id: 7,
            titulo: "Asado de Tira a la Parrilla",
            imagen: "/src/assets/image/entrania1.jpg",
            contenido: `
                <h3>Ingredientes</h3>
                <ul>
                    <li>1.5 kg de asado de tira de calidad</li>
                    <li>Sal gruesa</li>
                    <li>Pimienta negra recién molida</li>
                    <li>Opcional: ajo picado</li>
                </ul>

                <h3>Técnica de Asado</h3>
                <ol>
                    <li>Retira la carne del refrigerador 30 minutos antes</li>
                    <li>Calienta la parrilla a temperatura media-alta</li>
                    <li>Sazona generosamente con sal gruesa en ambos lados</li>
                    <li>Coloca el asado perpendicular a las barras</li>
                    <li>Cocina 25 minutos por lado sin mover constantemente</li>
                    <li>Verifica la cocción con el método del dedo (toque medio)</li>
                </ol>

                <h3>Reposo y Servida</h3>
                <p>Deja reposar 5 minutos antes de cortar. El reposo es fundamental para mantener los jugos dentro de la carne. Corta contra el grano para obtener porciones más tiernas.</p>
            `
        },
        3: {
            id: 3,
            titulo: "Entraña a la Parrilla",
            imagen: "/src/assets/image/entrania3.jpg",
            contenido: `
                <h3>Ingredientes</h3>
                <ul>
                    <li>800g de entraña fresca</li>
                    <li>Sal marina</li>
                    <li>Pimienta negra</li>
                    <li>Aceite de oliva</li>
                    <li>Limón fresco</li>
                </ul>

                <h3>Preparación y Cocción</h3>
                <ol>
                    <li>Limpia la entraña removiendo las membranas externas</li>
                    <li>Frota ligeramente con aceite de oliva y sal</li>
                    <li>Coloca en parrilla bien caliente durante 8-10 minutos por lado</li>
                    <li>La carne debe quedar rosada en el interior</li>
                    <li>Rocía con jugo de limón recién exprimido</li>
                </ol>

                <h3>Por Qué la Entraña es Especial</h3>
                <p>La entraña es considerada el corte más sabroso por su contenido de grasa y colágeno. Su textura tierna y su sabor intenso la hacen perfecta para asar lentamente. No requiere muchas especias, solo sal y un buen fuego.</p>
            `
        },
        4: {
            id: 4,
            titulo: "Lomo Liso: Jugosidad Garantizada",
            imagen: "/src/assets/image/lomo-liso1.jpg",
            contenido: `
                <h3>Ingredientes</h3>
                <ul>
                    <li>1 kg de lomo liso de primera</li>
                    <li>Sal gruesa</li>
                    <li>Pimienta negra</li>
                    <li>Romero fresco</li>
                    <li>Ajo en dientes</li>
                </ul>

                <h3>Preparación Premium</h3>
                <ol>
                    <li>Retira el lomo 45 minutos antes de cocinar</li>
                    <li>Haz pequenos cortes e inserta ramitas de romero y ajo</li>
                    <li>Sazona con sal y pimienta gruesa 15 minutos antes</li>
                    <li>Asa a fuego medio 18-20 minutos por lado</li>
                    <li>Para punto medio interno, usa termómetro a 55-60°C</li>
                </ol>

                <h3>Presentación Especial</h3>
                <p>El lomo liso es el corte más tierno de la parrilla. Su sabor delicado se complementa perfectamente con hierbas aromáticas. Sírvelo rebanado finamente, acompañado de una reducción de vino tinto o chimichurri casero.</p>
            `
        },
        6: {
            id: 6,
            titulo: "Parrillada Familiar Completa",
            imagen: "/src/assets/image/parrillada.jpg",
            contenido: `
                <h3>Ingredientes para 6-8 personas</h3>
                <ul>
                    <li>1 kg de asado de tira</li>
                    <li>500g de entraña</li>
                    <li>500g de lomo liso</li>
                    <li>8 chorizos artesanales</li>
                    <li>1 kg de papas para asar</li>
                    <li>Ensalada fresca variada</li>
                    <li>Pan tostado casero</li>
                </ul>

                <h3>Plan de Cocción</h3>
                <ol>
                    <li>Inicia con las papas (30 minutos antes en papel aluminio)</li>
                    <li>A los 15 minutos agrega el asado de tira</li>
                    <li>A los 10 minutos más, la entraña y el lomo</li>
                    <li>Los últimos 10 minutos, los chorizos</li>
                    <li>Tuesta el pan los últimos 2-3 minutos</li>
                </ol>

                <h3>El Ambiente Perfecto</h3>
                <p>Una parrillada familiar es más que comida, es un momento especial. Prepara música, bebidas frías y deja que el aroma de la parrilla invada el ambiente. Cada corte de carne trae su propia magia al encuentro.</p>
            `
        }
    };

    const receta = recetas[id];

    if (!receta) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1>❌ Receta no encontrada</h1>
                <button 
                    onClick={() => navigate('/blog')} 
                    className="btn"
                    style={{ maxWidth: '200px', margin: '2rem auto' }}
                >
                    Volver a Recetas
                </button>
            </main>
        );
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/blog')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#D2691E',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    textDecoration: 'underline'
                }}
            >
                ← Volver a Recetas
            </button>

            <article style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #f0e6e6' }}>
                <img 
                    src={receta.imagen} 
                    alt={receta.titulo}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }}
                />
                
                <h1 style={{ color: '#8B0000', marginBottom: '1rem' }}>{receta.titulo}</h1>
                
                <div 
                    style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#333' }}
                    dangerouslySetInnerHTML={{ __html: receta.contenido }}
                />

                <button 
                    onClick={() => navigate('/productos')}
                    className="btn"
                    style={{ marginTop: '2rem' }}
                >
                    Comprar ingredientes
                </button>
            </article>
        </main>
    );
}
