-- Ejecuta esto en Supabase: SQL Editor > New query > Run

create table if not exists producto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  equipo text not null,
  abrev text not null,
  precio int not null,
  stock int not null default 0,
  imagen text
);

create table if not exists usuario (
  id uuid primary key default gen_random_uuid(),
  nombres text not null,
  email text not null unique,
  contrasena text not null
);

-- Permitimos leer y escribir con la anon key (proyecto de clase).
alter table producto disable row level security;
alter table usuario disable row level security;

insert into producto (nombre, equipo, abrev, precio, stock, imagen) values
  ('Camiseta Miami Heat', 'Miami Heat', 'MIA', 249, 7, 'images/productos/153393579.jpg'),
  ('Camiseta Lakers Negro', 'Los Angeles Lakers', 'LAL', 269, 12, 'images/productos/153393600.jpg'),
  ('Camiseta Chicago Bulls Negra', 'Chicago Bulls', 'CHI', 259, 5, 'images/productos/153393569.jpg'),
  ('Camiseta Chicago Bulls Blanca', 'Chicago Bulls', 'CHI', 259, 15, 'images/productos/153393587.jpg'),
  ('Camiseta Chicago Bulls Classic', 'Chicago Bulls', 'CHI', 239, 0, 'images/productos/153394666.jpg'),
  ('Camiseta NBA Chicago Bulls', 'Chicago Bulls', 'CHI', 219, 9, 'images/productos/155204065.jpg'),
  ('Chompa Lakers', 'Los Angeles Lakers', 'LAL', 349, 3, 'images/productos/153393566.jpg'),
  ('Camiseta Lakers NBA', 'Los Angeles Lakers', 'LAL', 199, 18, 'images/productos/128454883.jpg'),
  ('Chompa Miami Heat', 'Miami Heat', 'MIA', 339, 4, 'images/productos/153393562.jpg'),
  ('Camiseta NBA Chicago Bulls Retro', 'Chicago Bulls', 'CHI', 209, 11, 'images/productos/128457302.jpg'),
  ('Camiseta Milwaukee Bucks Blanca', 'Milwaukee Bucks', 'MIL', 229, 2, 'images/productos/117698653.jpg'),
  ('Camisilla Chicago Bulls Roja', 'Chicago Bulls', 'CHI', 179, 14, 'images/productos/153393585.jpg'),
  ('Camisilla Chicago Bulls Negra', 'Chicago Bulls', 'CHI', 179, 0, 'images/productos/153394670.jpg'),
  ('Jersey Los Angeles Lakers Negro', 'Los Angeles Lakers', 'LAL', 289, 6, 'images/productos/153394691.jpg'),
  ('Jersey Chicago Bulls Negro', 'Chicago Bulls', 'CHI', 289, 13, 'images/productos/153394683.jpg'),
  ('Camisilla Miami Heat Jaquez Jr.', 'Miami Heat', 'MIA', 199, 1, 'images/productos/153394679.jpg'),
  ('Camiseta Boston Celtics Essential', 'Boston Celtics', 'BOS', 239, 16, 'images/productos/132918675.jpg'),
  ('Camiseta Bulls Cuello Contrastado', 'Chicago Bulls', 'CHI', 249, 8, 'images/productos/155804395.jpg'),
  ('Camiseta Chicago Bulls City Edition', 'Chicago Bulls', 'CHI', 279, 0, 'images/productos/150975206.jpg'),
  ('Camiseta Miami Heat Butler', 'Miami Heat', 'MIA', 269, 10, 'images/productos/155804029.jpg');
