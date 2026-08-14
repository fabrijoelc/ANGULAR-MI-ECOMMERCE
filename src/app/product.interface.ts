export interface IProductoTienda {
  id: number;
  nombre: string;
  equipo: string;
  abrev: string;
  precio: number;
  imagen: string;
  stock: number;
}

export interface IProductoCarrito {
  id: number;
  nombre: string;
  equipo: string;
  abrev: string;
  precio: number;
  cantidad: number;
  imagen: string;
}
