export interface IProductoTienda {
  id: string;
  nombre: string;
  equipo: string;
  abrev: string;
  precio: number;
  stock: number;
  imagen: string;
}

export interface IProductoCarrito {
  id: string;
  nombre: string;
  equipo: string;
  abrev: string;
  precio: number;
  cantidad: number;
  imagen: string;
}
