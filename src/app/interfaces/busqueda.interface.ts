import { IProductoTienda } from './producto.interface';

// Lo que devuelve una busqueda paginada: la pagina pedida y el total real.
export interface IBusquedaRespuesta {
  data: IProductoTienda[];
  total: number;
}
