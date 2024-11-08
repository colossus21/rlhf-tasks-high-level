#!/usr/bin/env julia

"""
Basic image binarization script demonstrating Otsu's and Bernsen's methods
using the ImageBinarization package in Julia.
"""

# Import required packages
using Pkg

# Function to ensure required packages are installed
function ensure_packages()
    required_packages = ["Images", "ImageBinarization"]
    for package in required_packages
        if !haskey(Pkg.installed(), package)
            @info "Installing $package..."
            Pkg.add(package)
        end
    end
end

# Install required packages if not already installed
ensure_packages()

using Images
using ImageBinarization
using FileIO

"""
Convert an image to grayscale if it's RGB
"""
function ensure_grayscale(img)
    if eltype(img) <: RGB
        return Gray.(img)
    end
    return img
end

"""
Process an image with both Otsu's and Bernsen's methods
"""
function process_image(image_path; output_dir="binarized_output", window_size=15)
    # Create output directory if it doesn't exist
    mkpath(output_dir)
    
    # Load and prepare image
    println("Loading image: $image_path")
    img = load(image_path)
    img_gray = ensure_grayscale(img)
    
    # Save grayscale image
    grayscale_path = joinpath(output_dir, "grayscale.png")
    save(grayscale_path, img_gray)
    println("Saved grayscale image to: $grayscale_path")
    
    # Apply Otsu's method
    println("Applying Otsu's method...")
    try
        otsu_img = binarize(img_gray, Otsu())
        otsu_path = joinpath(output_dir, "otsu_binarized.png")
        save(otsu_path, otsu_img)
        println("Saved Otsu's binarization to: $otsu_path")
    catch e
        println("Error applying Otsu's method: $e")
    end
    
    # Apply Bernsen's method
    println("Applying Bernsen's method...")
    try
        bernsen_img = binarize(img_gray, Bernsen(window_size))
        bernsen_path = joinpath(output_dir, "bernsen_binarized.png")
        save(bernsen_path, bernsen_img)
        println("Saved Bernsen's binarization to: $bernsen_path")
    catch e
        println("Error applying Bernsen's method: $e")
    end
end

"""
Print usage instructions
"""
function print_usage()
    println("""
    Image Binarization Script
    -------------------------
    Usage:
    1. Run directly with an image path:
       julia script.jl path/to/image.jpg
    
    2. Or import in Julia REPL and use:
       include("script.jl")
       process_image("path/to/image.jpg")
    
    Optional parameters:
    - window_size: Size of local neighborhood for Bernsen's method (default: 15)
    - output_dir: Directory to save output images (default: "binarized_output")
    
    Example:
    process_image("image.jpg", window_size=20, output_dir="output")
    """)
end

# Main execution
if abspath(PROGRAM_FILE) == @__FILE__
    if length(ARGS) == 0
        print_usage()
    else
        image_path = ARGS[1]
        if !isfile(image_path)
            println("Error: Image file not found: $image_path")
            exit(1)
        end
        process_image(image_path)
    end
end