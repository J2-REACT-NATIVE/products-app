import { productsApi } from "@/core/api/productsApi";
import { Product } from "../interfaces/product.interface";

export const updateCreateProduct = (product: Partial<Product>) => {
  //nos aseguramos que stock y price sean numeros
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  if (product.id && product.id !== "new") {
    return updateProduct(product);
  }

  return createProduct(product);
};
const getImageMimeType = (uri: string) => {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (extension === "png") return "image/png";
  if (extension === "heic") return "image/heic";
  if (extension === "heif") return "image/heif";
  if (extension === "webp") return "image/webp";

  return "image/jpeg";
};
const prepareImages = async (images: string[]): Promise<string[]> => {
  //! en este punto el array de images va a contener las imagenes que ya estan en el backend y las que el usuario selecciono en su galeria o desde la pagina de la camara. Por ese motivo hay que manejarlas por separado.
  //! Imagenes de la galeria

  const fileImages = images.filter((image) => image.includes("file:"));

  //! Imagenes del backend
  const currentImages = images.filter((image) => !image.includes("file:"));

  if (fileImages.length > 0) {
    //! Cargamos un array de promesas: Promise<string>[] para luego cargalar en simultaneo
    const uploadPromises = fileImages.map(
      async (image) => await uploadImage(image),
    );
    const uploadedImages = await Promise.all(uploadPromises);
    //!al array con las imagenes actuales del producto le sumamos las nuevas imagenes subidad al backend
    currentImages.push(...uploadedImages);
  }

  //! aqui depuramos el arreglo quedandonos solo con el uuid y quitar lo que es la URI, con pop extraemos el ultimo elemento del array que ya es el uuid
  return currentImages.map((image) => image.split("/").pop()!);
};
const uploadImage = async (image: string): Promise<string> => {
  console.log({ uploadImage: image });
  const formData = new FormData() as any;

  try {
    formData.append("file", {
    //! como es por app es necesario URI
    uri: image,
    //type: "image/jpeg",
    type:getImageMimeType(image),
    //! con pop extraemos el ultimo elemento del array que ya es el uuid: "file:///var/mobile/Containers/Data/Application/3E965EC3-B812-4E98-B9DD-F171DC5B6B13/Library/Caches/ExponentExperienceData/@anonymous/products-app-f8039e0f-5085-4b56-8c7c-0c40cc0941f4/ImagePicker/532EB338-7FF6-4DBF-86F1-62482AA90BA5.jpg"
    name: image.split("/").pop()!,
  });

  const { data } = await productsApi.post<{ image: string }>(
    "/files/product",
    formData,
    // {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // },
  );

  return data.image;
  } catch (error:any) {
    console.log("upload error status", error.response?.status);
  console.log("upload error data", error.response?.data);
    throw new Error("Error al cargar imagenes");
  }
  
};

const updateProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const checkImages = await prepareImages(images);

    const { data } = await productsApi.patch<Product>(`/products/${id}`, {
      // todo: images
      ...rest,
      images: checkImages,
    });

    return data;
  } catch (error) {
    throw new Error("Error al actualizar el producto");
  }
};

const createProduct = async (product: Partial<Product>) => {
  const { id, images = [], user, ...rest } = product;

  try {
    const checkImages = await prepareImages(images);
    const { data } = await productsApi.post<Product>(`/products`, {
      // todo: images
      ...rest,
      images: checkImages,
    });

    return data;
  } catch (error) {
    throw new Error("Error al actualizar el producto");
  }
};
