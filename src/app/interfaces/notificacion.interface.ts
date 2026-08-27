export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface INotificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
}
