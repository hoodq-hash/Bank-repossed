import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '@/lib/mongodb';
import Car from '@/models/Car';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwoaukreo",
  api_key: process.env.CLOUDINARY_API_KEY || "378833648339572",
  api_secret: process.env.CLOUDINARY_API_SECRET || "11daIfpiOnJEsAUeCIKzKShVzSw",
});

// GET all cars
export async function GET() {
  try {
    await connectToDatabase();
    const cars = await Car.find({}).sort({ createdAt: -1 });
    
    // Transform MongoDB _id to id for frontend compatibility
    const transformedCars = cars.map(car => {
      const carObj = car.toObject();
      carObj.id = carObj._id.toString();
      return carObj;
    });
    
    return NextResponse.json(transformedCars, { status: 200 });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// POST a new car
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    // Handle image uploads to Cloudinary if images are provided
    let imageUrls = [];
    
    if (body.images && body.images.length > 0) {
      // Filter out any images that are already URLs (not base64)
      const imagesToUpload = body.images.filter(img => 
        typeof img === 'string' && img.startsWith('data:')
      );
      
      // Upload each image to Cloudinary
      const uploadPromises = imagesToUpload.map(async (image, index) => {
        try {
          const uniqueIdentifier = `${body.make}-${body.model}-${Date.now()}-${index}`;
          const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: uniqueIdentifier,
            folder: 'cars45'
          });
          return uploadResult.secure_url;
        } catch (uploadError) {
          console.error('Error uploading image to Cloudinary:', uploadError);
          return null;
        }
      });
      
      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Filter out any failed uploads
      imageUrls = uploadedImages.filter(url => url !== null);
      
      // If there were existing image URLs, keep them
      const existingImageUrls = body.images.filter(img => 
        typeof img === 'string' && !img.startsWith('data:')
      );
      
      imageUrls = [...existingImageUrls, ...imageUrls];
    }
    
    // If no images were uploaded or provided, use a default placeholder
    if (imageUrls.length === 0) {
      imageUrls = ['/cars/placeholder-car.jpg'];
    }
    
    // Ensure numeric fields are properly converted
    const carData = {
      ...body,
      price: Number(body.price),
      year: Number(body.year),
      mileage: Number(body.mileage),
      images: imageUrls
    };
    
    // Create a new car
    const car = await Car.create(carData);
    
    // Transform the response for frontend
    const carObj = car.toObject();
    carObj.id = carObj._id.toString();
    
    return NextResponse.json(carObj, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ 
      error: 'Failed to create car',
      message: error.message
    }, { status: 500 });
  }
}