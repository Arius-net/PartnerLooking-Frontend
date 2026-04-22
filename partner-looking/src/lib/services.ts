import {
  AUTH_LOGIN_PATH,
  AUTH_REGISTER_PATH,
  deleteJson,
  getJson,
  postFormData,
  postJson,
  putJson,
} from "@/lib/api";

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type AuthResult = {
  token: string;
  role: string;
  userId: string;
};

type RawAuthResult = {
  token?: string;
  accessToken?: string;
  id?: string;
  userId?: string;
  role?: string;
  rol?: string;
  data?: {
    token?: string;
    accessToken?: string;
    id?: string;
    userId?: string;
    role?: string;
    rol?: string;
    user?: {
      id?: string;
      userId?: string;
      role?: string;
      rol?: string;
    };
    usuario?: {
      id?: string;
      userId?: string;
      role?: string;
      rol?: string;
    };
  };
  user?: {
    id?: string;
    userId?: string;
    role?: string;
    rol?: string;
  };
  usuario?: {
    id?: string;
    userId?: string;
    role?: string;
    rol?: string;
  };
};

function decodeUserIdFromToken(token: string): string {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return "";
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
      sub?: unknown;
      userId?: unknown;
      id?: unknown;
    };

    if (typeof payload.userId === "string" && payload.userId.trim().length > 0) {
      return payload.userId;
    }
    if (typeof payload.id === "string" && payload.id.trim().length > 0) {
      return payload.id;
    }
    if (typeof payload.sub === "string" && payload.sub.trim().length > 0) {
      return payload.sub;
    }
    return "";
  } catch {
    return "";
  }
}

function mapAuthResult(raw: RawAuthResult): AuthResult {
  const source = raw.data || raw;
  const token = source.token || source.accessToken || raw.token || raw.accessToken || "";
  const role = source.role || source.rol || source.user?.role || source.user?.rol || source.usuario?.role || source.usuario?.rol || raw.role || raw.rol || "";
  const userId = source.user?.id || source.user?.userId || source.usuario?.id || source.usuario?.userId || source.id || source.userId || raw.user?.id || raw.user?.userId || raw.usuario?.id || raw.usuario?.userId || raw.id || raw.userId || decodeUserIdFromToken(token);
  return { token, role, userId };
}

export async function getHealth(): Promise<{ status?: string; message?: string }> {
  return getJson<{ status?: string; message?: string }>("/health", false);
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const raw = await postJson<RawAuthResult>(AUTH_LOGIN_PATH, input, false);
  return mapAuthResult(raw);
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const raw = await postJson<RawAuthResult>(
    AUTH_REGISTER_PATH,
    {
      name: input.name,
      nombreCompleto: input.name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      telefono: input.phone,
    },
    false,
  );
  return mapAuthResult(raw);
}

export type UserProfile = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  university: string;
  career: string;
  semester: string;
  about: string;
};

type RawUser = {
  id?: string;
  userId?: string;
  name?: string;
  nombre?: string;
  nombre_completo?: string;
  nombreCompleto?: string;
  fullName?: string;
  username?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  edad?: number;
  age?: number;
  genero?: string;
  gender?: string;
  universidad?: string;
  university?: string;
  carrera?: string;
  career?: string;
  semestre?: string;
  semester?: string;
  sobre_mi?: string;
  about?: string;
  avatar?: string;
  foto_perfil?: string;
};

function mapUser(raw: RawUser): UserProfile {
  return {
    id: raw.id || raw.userId || "",
    fullName: raw.fullName || raw.nombreCompleto || raw.nombre_completo || raw.name || raw.nombre || "",
    username: raw.username || (raw.email ? raw.email.split("@")[0] : ""),
    email: raw.email || "",
    phone: raw.phone || raw.telefono || "",
    age: Number(raw.age || raw.edad || 0),
    gender: raw.gender || raw.genero || "",
    university: raw.university || raw.universidad || "",
    career: raw.career || raw.carrera || "",
    semester: raw.semester || raw.semestre || "",
    about: raw.about || raw.sobre_mi || "",
  };
}

function mapUpdateProfilePayload(input: Partial<UserProfile>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries({
      fullName: input.fullName,
      nombreCompleto: input.fullName,
      phone: input.phone,
      telefono: input.phone,
      age: input.age,
      edad: input.age,
      gender: input.gender,
      genero: input.gender,
      university: input.university,
      universidad: input.university,
      career: input.career,
      carrera: input.career,
      semester: input.semester,
      semestre: input.semester,
      about: input.about,
      sobre_mi: input.about,
      username: input.username,
    }).filter(([, value]) => value !== undefined && value !== "" && value !== null),
  );
}

export async function getUserById(userId: string): Promise<UserProfile> {
  const raw = await getJson<RawUser | { user?: RawUser; data?: RawUser }>(`/users/${userId}`, false);
  const payload = (raw as { user?: RawUser; data?: RawUser }).user || (raw as { user?: RawUser; data?: RawUser }).data || (raw as RawUser);
  return mapUser(payload);
}

export async function updateUserProfile(input: Partial<UserProfile>): Promise<UserProfile> {
  const raw = await putJson<RawUser | { user?: RawUser }>("/users/profile", mapUpdateProfilePayload(input));
  return mapUser((raw as { user?: RawUser }).user || (raw as RawUser));
}

export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  await putJson("/users/config/password", {
    currentPassword,
    newPassword,
    current_password: currentPassword,
    new_password: newPassword,
  });
}

export async function deleteUserAccount(password?: string): Promise<void> {
  await deleteJson(password ? `/users/config/account?password=${encodeURIComponent(password)}` : "/users/config/account");
}

export async function getUserContact(userId: string): Promise<{ email: string; phone: string }> {
  const raw = await getJson<{ email?: string; phone?: string; telefono?: string; data?: { email?: string; phone?: string; telefono?: string } }>(`/users/${userId}/contact`);
  const payload = raw.data || raw;
  return {
    email: payload.email || "",
    phone: payload.phone || payload.telefono || "",
  };
}

export type Listing = {
  id: string;
  title: string;
  location: string;
  city: string;
  neighborhood: string;
  price: number;
  people: string;
  image: string;
  lat: number;
  lng: number;
  hostId: string;
};

type RawListing = {
  id?: string;
  title?: string;
  titulo?: string;
  location?: string;
  direccion?: string;
  address?: string;
  city?: string;
  ciudad?: string;
  neighborhood?: string;
  colonia?: string;
  price?: number;
  precio?: number;
  people?: string;
  numero_roommates?: string;
  image?: string;
  imageUrl?: string;
  foto_principal?: string;
  images?: string[];
  fotos?: string[];
  lat?: number;
  lng?: number;
  latitud?: number;
  longitud?: number;
  hostId?: string;
  autor_id?: string;
  userId?: string;
  user_id?: string;
};

function mapListing(raw: RawListing): Listing {
  const image = raw.image || raw.imageUrl || raw.foto_principal || raw.images?.[0] || raw.fotos?.[0] || "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200";

  return {
    id: raw.id || "",
    title: raw.title || raw.titulo || "Publicación",
    location: raw.location || raw.direccion || raw.address || "Ubicación no disponible",
    city: raw.city || raw.ciudad || "",
    neighborhood: raw.neighborhood || raw.colonia || "",
    price: Number(raw.price || raw.precio || 0),
    people: raw.people || raw.numero_roommates || "",
    image,
    lat: Number(raw.lat || raw.latitud || 0),
    lng: Number(raw.lng || raw.longitud || 0),
    hostId: raw.hostId || raw.autor_id || raw.userId || raw.user_id || "",
  };
}

export type CreateListingInput = {
  title: string;
  description: string;
  address: string;
  city: string;
  neighborhood: string;
  price: number;
  availableFrom: string;
  numberOfRoommates: string;
  lat: number;
  lng: number;
  type: string;
};

function assertValidCoordinate(lat: number, lng: number): void {
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new Error("La latitud debe estar entre -90 y 90.");
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new Error("La longitud debe estar entre -180 y 180.");
  }
}

export async function getListings(): Promise<Listing[]> {
  const raw = await getJson<RawListing[] | { listings?: RawListing[]; data?: RawListing[] }>("/listings", false);
  const list = Array.isArray(raw) ? raw : raw.listings || raw.data || [];
  return list.map(mapListing);
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const raw = await postJson<RawListing | { listing?: RawListing }>("/listings", {
    title: input.title,
    titulo: input.title,
    description: input.description,
    descripcion: input.description,
    address: input.address,
    direccion: input.address,
    city: input.city,
    ciudad: input.city,
    neighborhood: input.neighborhood,
    colonia: input.neighborhood,
    price: input.price,
    precio: input.price,
    availableFrom: input.availableFrom,
    disponible_desde: input.availableFrom,
    numberOfRoommates: input.numberOfRoommates,
    numero_roommates: input.numberOfRoommates,
    lat: input.lat,
    lng: input.lng,
    latitud: input.lat,
    longitud: input.lng,
    type: input.type,
    tipo_publicacion: input.type,
  });

  return mapListing((raw as { listing?: RawListing }).listing || (raw as RawListing));
}

export async function getNearbyListings(lat: number, lng: number): Promise<Listing[]> {
  assertValidCoordinate(lat, lng);
  const raw = await getJson<RawListing[] | { listings?: RawListing[]; data?: RawListing[] }>(
    `/listings/nearby?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`,
    false,
  );

  const list = Array.isArray(raw) ? raw : raw.listings || raw.data || [];
  return list.map(mapListing);
}

export async function uploadValidationDocument(documentFile: File): Promise<{ verificationId: string; status: string }> {
  const formData = new FormData();
  formData.append("documento", documentFile);
  const raw = await postFormData<{ id?: string; verificationId?: string; status?: string; data?: { id?: string; verificationId?: string; status?: string } }>("/validations/upload", formData);
  const payload = raw.data || raw;
  return {
    verificationId: payload.verificationId || payload.id || "",
    status: payload.status || "PENDING",
  };
}

export async function updateValidationStatus(verificationId: string, status: "VALID" | "REJECTED"): Promise<void> {
  await putJson(`/validations/${verificationId}/status`, {
    status,
  });
}

export async function addFavorite(listingId: string): Promise<void> {
  await postJson(`/favorites/${listingId}`, {});
}

export async function removeFavorite(listingId: string): Promise<void> {
  await deleteJson(`/favorites/${listingId}`);
}

export async function createReview(userId: string, rating: number, comment?: string): Promise<void> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("La calificación debe estar entre 1 y 5.");
  }

  await postJson(`/reviews/${userId}`, {
    rating,
    calificacion: rating,
    comment: comment || "",
    comentario: comment || "",
  });
}
