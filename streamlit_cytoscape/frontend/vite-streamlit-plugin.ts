/**
 * Custom Vite plugin for Streamlit component post-processing
 * Handles asset copying, HTML modification, and file structure setup
 */

import { Plugin } from 'vite'
import { copyFileSync, readFileSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'

export function streamlitComponentPlugin(): Plugin {
  return {
    name: 'streamlit-component',
    writeBundle() {
      try {
        const buildDir = 'build'
        const publicDir = 'public'
        
        // 1. Copy bootstrap.min.css to build directory
        const bootstrapSrc = join(publicDir, 'bootstrap.min.css')
        const bootstrapDest = join(buildDir, 'bootstrap.min.css')
        
        if (existsSync(bootstrapSrc)) {
          copyFileSync(bootstrapSrc, bootstrapDest)
          console.log('✓ Copied bootstrap.min.css to build directory')
        }
        
        // 2. Move index.html from build/public/ to build/ if it exists there
        const htmlSrc = join(buildDir, 'public', 'index.html')
        const htmlDest = join(buildDir, 'index.html')
        
        if (existsSync(htmlSrc)) {
          copyFileSync(htmlSrc, htmlDest)
          console.log('✓ Moved index.html to build root')
        }
        
        // 3. Process the HTML file if it exists
        if (existsSync(htmlDest)) {
          let htmlContent = readFileSync(htmlDest, 'utf-8')
          
          // Fix asset paths (../assets/ → ./assets/)
          htmlContent = htmlContent.replace(/\.\.\/assets\//g, './assets/')
          
          // Add bootstrap CSS link if not present
          if (!htmlContent.includes('bootstrap.min.css')) {
            htmlContent = htmlContent.replace(
              /<\/title>/,
              '</title>\n    <link rel="stylesheet" href="./bootstrap.min.css" />'
            )
          }
          
          writeFileSync(htmlDest, htmlContent, 'utf-8')
          console.log('✓ Fixed asset paths and added bootstrap CSS link')
        }
        
        // 4. Remove build/public directory if it exists and is empty
        const publicBuildDir = join(buildDir, 'public')
        if (existsSync(publicBuildDir)) {
          try {
            rmSync(publicBuildDir, { recursive: true })
            console.log('✓ Removed empty build/public directory')
          } catch (error) {
            // Directory might not be empty or have permission issues
            console.warn('Could not remove build/public directory:', error)
          }
        }
        
        console.log('✅ Streamlit component build post-processing completed')
        
      } catch (error) {
        console.error('❌ Error in Streamlit component plugin:', error)
        throw error
      }
    }
  }
}