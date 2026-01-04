import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectToDatabase from "@/lib/mongodb";
import SCar from "@/models/SCar";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET a specific car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const car = await SCar.findById(params.id);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Transform for frontend
    const carObj = car.toObject();
    carObj.id = carObj._id.toString();

    return NextResponse.json(carObj);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// UPDATE a car by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    await connectToDatabase();

    // Handle image uploads to Cloudinary if new images are provided
    let imageUrls = body.images || [];

    // Check if there are any base64 images to upload
    const imagesToUpload = imageUrls.filter(
      (img) => typeof img === "string" && img.startsWith("data:")
    );

    if (imagesToUpload.length > 0) {
      // Upload each new image to Cloudinary
      const uploadPromises = imagesToUpload.map(async (image, index) => {
        try {
          const uniqueIdentifier = `${body.make}-${
            body.model
          }-${Date.now()}-${index}`;
          const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: uniqueIdentifier,
            folder: "cars45",
          });
          return uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          return null;
        }
      });

      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);

      // Filter out any failed uploads
      const newImageUrls = uploadedImages.filter((url) => url !== null);

      // Keep existing image URLs (those that aren't base64)
      const existingImageUrls = imageUrls.filter(
        (img) => typeof img === "string" && !img.startsWith("data:")
      );

      imageUrls = [...existingImageUrls, ...newImageUrls];
    }

    // Ensure numeric fields are properly converted
    const updateData = {
      ...body,
      price: Number(body.price),
      year: Number(body.year),
      mileage: Number(body.mileage),
      images: imageUrls,
    };

    // Remove id from update data if present
    delete updateData.id;
    delete updateData._id;

    const updatedCar = await SCar.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Transform for frontend
    const carObj = updatedCar.toObject();
    carObj.id = carObj._id.toString();

    return NextResponse.json(carObj);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}

// DELETE a car by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const deletedCar = await SCar.findByIdAndDelete(params.id);

    if (!deletedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
