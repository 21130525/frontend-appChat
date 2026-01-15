const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

type MediaType = "image" | "video";

/**
 * Upload file to Cloudinary and return the secure URL
 */
export async function uploadToCloudinary(
    file: File,
    type: MediaType
): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        console.error("Cloudinary config is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.", {
            CLOUD_NAME,
            UPLOAD_PRESET,
        });
        throw new Error("Thiếu cấu hình Cloudinary");
    }

    const resourceType = type === "image" ? "image" : "video";
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    console.log("Uploading to Cloudinary:", { url, resourceType, fileName: file.name, fileType: file.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Cloudinary upload failed", text);
        throw new Error("Upload Cloudinary thất bại");
    }

    const data = await response.json();
    // secure_url là URL https ổn định
    console.log("Cloudinary upload success:", data.secure_url);
    return data.secure_url as string;
}

