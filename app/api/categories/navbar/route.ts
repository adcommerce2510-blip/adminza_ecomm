import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import SubCategory from '@/models/SubCategory'
import Level2Category from '@/models/Level2Category'

import { toSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
  } catch (connectionError) {
    console.warn('Navbar: MongoDB unreachable, returning empty categories.', connectionError instanceof Error ? connectionError.message : connectionError)
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    // Fetch all categories, subcategories, and level2 categories
    const categories = await Category.find().sort({ createdAt: 1 })
    const subcategories = await SubCategory.find().sort({ createdAt: 1 })
    const level2Categories = await Level2Category.find().sort({ createdAt: 1 })

    // Build navbar data structure
    const navbarData = categories.map(category => {
      const categorySubcategories = subcategories.filter(sub => 
        sub.mainCategory === category.name
      ).map(sub => {
        const subLevel2Categories = level2Categories.filter(level2 => 
          level2.mainCategory === category.name && level2.subCategory === sub.name
        )

        return {
          name: sub.name,
          href: `/${toSlug(sub.name)}`,
          nested: subLevel2Categories.length > 0 ? subLevel2Categories.map(level2 => ({
            name: level2.name,
            href: `/${toSlug(level2.name)}`
          })) : undefined
        }
      })

      return {
        title: category.name,
        subcategories: [

          ...categorySubcategories.map(sub => ({
            ...sub,
            href: `/${toSlug(sub.name)}`
          }))
        ]
      }
    })

    return NextResponse.json({
      success: true,
      data: navbarData
    })

  } catch (error) {
    console.error('Error fetching navbar data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch navbar data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
