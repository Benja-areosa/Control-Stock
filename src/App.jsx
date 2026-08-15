import { useState, useEffect } from 'react';

function App () {

  const [productos, setProductos] = useState(() => {
    const inventarioGuardado = localStorage.getItem ('stockDeposito');
    if (inventarioGuardado) {
      return JSON.parse(inventarioGuardado);
    }

    return [
      { id: 1, nombre: 'Choco Almendra', cantidad: 5, categoria: 'Tentaciones'},
      { id: 2, nombre: 'Frutilla a la Crema', cantidad: 3, categoria: 'Latas', variedad: 'Cremas'}
    ];
  });

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Latas'); 
  const [nuevaVariedad, setNuevaVariedad] = useState ('Cremas');

  const categoriasDisponibles = ['Tentaciones', 'Latas', 'Bombones', 'Familiares', 'Palitos', 'Frizzio', 'Insumos'];
  const variedadLatas = ['Cremas', 'Chocolate', 'Dulce de leche', 'Al agua'];

  useEffect (() => {
    localStorage.setItem('stockDeposito', JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = (e) => {
    e.preventDefault(); 
    
    const nuevoProducto = {
      id: Date.now(), 
      nombre: nuevoNombre,
      cantidad: parseInt(nuevaCantidad),
      categoria: nuevaCategoria,
      variedad: nuevaCategoria === 'Latas' ? nuevaVariedad : null
    };

    setProductos([...productos, nuevoProducto]);
    
    setNuevoNombre('');
    setNuevaCantidad('');
    setNuevaCategoria('Tentaciones');
    setNuevaVariedad('Cremas');
  };

  const cambiarStock = (id, cantidadCambio) => {
    const inventarioActualizado = productos.map(producto => {
      if (producto.id === id) {
        const calculo = producto.cantidad + cantidadCambio;
        const nuevaCantidad = calculo < 0 ? 0 : calculo;
        return { ...producto, cantidad: nuevaCantidad};
      }
      return producto; 
    });
    
    setProductos(inventarioActualizado);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>¡Sistema de stock!</h1>
      
      <form onSubmit={agregarProducto} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Agregar nuevo producto</h3>
        
        <input 
          type="text" 
          placeholder="Nombre del producto" 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)} 
          style={{ marginRight: '10px' }}
          required
        />
        
        <input 
          type="number" 
          placeholder="Cantidad" 
          value={nuevaCantidad}
          onChange={(e) => setNuevaCantidad(e.target.value)}
          style={{ marginRight: '10px' }}
          min='0'
          required
        />

        <select 
          value={nuevaCategoria} 
          onChange={(e) => setNuevaCategoria(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {categoriasDisponibles.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {nuevaCategoria === 'Latas' && (
        <select value={nuevaVariedad}
        onChange={(e) => setNuevaVariedad(e.target.value)}
        style={{marginRight: '10px', backgroundColor: '#f1f1f1'}
        }>
          {variedadLatas.map(variedad => (
            <option key={variedad} value={variedad}>{variedad}</option>
          ))}
        </select>
        )}

        <button type="submit">Agregar al depósito</button>
      </form>

      <div>
        {categoriasDisponibles.map(categoria => {
          const productosDeEstaCategoria = productos.filter(
            producto => producto.categoria === categoria
          );

          if (productosDeEstaCategoria.length === 0) {
            return null;
          }

          return (
            <div key={categoria} style={{ marginBottom: '20px' }}>
              <h2 style={{ borderBottom: '2px solid black' }}>{categoria}</h2>
              <ul>
                {productosDeEstaCategoria.map(producto => (
                  <li key={producto.id} style={{ marginBottom: '10px' }}>
                    <strong>{producto.nombre}</strong> 
                    
                    {producto.variedad && <span style={{ color: 'gray' }}> ({producto.variedad})</span>}

                    {producto.cantidad === 0 
                      ? <span style={{ color: 'red', fontWeight: 'bold' }}>Sin stock</span> 
                      : <span>Total: {producto.cantidad}</span>
                    }
                    <button
                    onClick={() => cambiarStock(producto.id, -1)} 
                      style={{ marginLeft: '10px', cursor: producto.cantidad === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={producto.cantidad === 0}
                      >
                        -
                      </button>
                    <button onClick={() => cambiarStock(producto.id, 1)} style={{ marginLeft: '5px' }}>
                      +
                    </button>  
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      
    </div>
  )
}

export default App