import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Service from '@/models/Service'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const subSubcategory = searchParams.get('subSubcategory')

    let query: any = {}

    // Build hierarchical category query with flexible matching
    if (subSubcategory && subcategory && category) {
      // Level 2 category - most specific
      const categoryPath = `${category}/${subcategory}/${subSubcategory}`
      const categoryPathWithSpaces = `${category.replace(/-/g, ' ')}/${subcategory.replace(/-/g, ' ')}/${subSubcategory.replace(/-/g, ' ')}`
      
      query = {
        $or: [
          { category: categoryPath },
          { category: categoryPathWithSpaces },
          { category: { $regex: categoryPath, $options: 'i' } },
          { category: { $regex: categoryPathWithSpaces, $options: 'i' } },
          // Handle URL slug format directly
          { category: { $regex: categoryPathWithSpaces.replace(/&/g, '&'), $options: 'i' } },
          { level2Category: subSubcategory, subcategory: subcategory, category: category }
        ]
      }
    } else if (subcategory && category) {
      // Subcategory level - flexible matching
      const categoryPath = `${category}/${subcategory}`
      const categoryPathWithSpaces = `${category.replace(/-/g, ' ')}/${subcategory.replace(/-/g, ' ')}`
      
      query = {
        $or: [
          { category: categoryPath },
          { category: categoryPathWithSpaces },
          { category: { $regex: categoryPath, $options: 'i' } },
          { category: { $regex: categoryPathWithSpaces, $options: 'i' } },
          // Handle URL slug format directly - convert hyphens to spaces and handle &
          { category: { $regex: categoryPathWithSpaces.replace(/&/g, '&'), $options: 'i' } },
          { subcategory: subcategory, category: category }
        ]
      }
    } else if (category) {
      // Main category level - flexible matching
      const categoryWithSpaces = category.replace(/-/g, ' ')
      
      query = {
        $or: [
          { category: category },
          { category: categoryWithSpaces },
          { category: { $regex: `^${category}`, $options: 'i' } },
          { category: { $regex: `^${categoryWithSpaces}`, $options: 'i' } }
        ]
      }
    }

    const services = await Service.find(query).sort({ createdAt: -1 })

    // Remove duplicates by _id
    const uniqueServices = Array.from(new Map(services.map((item: any) => [item._id.toString(), item])).values())

    return NextResponse.json({
      success: true,
      data: uniqueServices
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    console.log('Creating service with data:', body)
    
    const service = new Service(body)
    await service.save()

    return NextResponse.json({
      success: true,
      data: service
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect()

    // Find all services and group by name + category
    const allServices = await Service.find({}).sort({ createdAt: -1 })
    
    const nameServiceMap = new Map()
    const servicesToDelete = []

    // Group by name-category combination
    for (const service of allServices) {
      const key = `${service.name}-${service.category}`
      
      if (!nameServiceMap.has(key)) {
        nameServiceMap.set(key, service._id)
      } else {
        // This is a duplicate, mark for deletion
        servicesToDelete.push(service._id)
      }
    }

    // Delete duplicates
    if (servicesToDelete.length > 0) {
      await Service.deleteMany({ _id: { $in: servicesToDelete } })
    }

    return NextResponse.json({
      success: true,
      message: `Removed ${servicesToDelete.length} duplicate services`,
      deleted: servicesToDelete
    })
  } catch (error) {
    console.error('Error deduplicating services:', error)
    return NextResponse.json(
      { error: 'Failed to deduplicate services' },
      { status: 500 }
    )
  }
}
