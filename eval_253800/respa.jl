#!/usr/bin/env julia

"""
Comprehensive demonstration of image binarization techniques using ImageBinarization.jl
This script shows various methods for converting grayscale images to binary (black and white).
"""

# Import required packages
using Pkg

# Function to ensure required packages are installed
function ensure_packages()
    required_packages = ["Images", "ImageBinarization", "TestImages", "FileIO", "ImageView"]
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
using TestImages
using FileIO
using ImageView

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
Apply multiple binarization methods to an image and save results
"""
function apply_binarization_methods(img, output_dir="binarized_output")
    # Create output directory if it doesn't exist
    mkpath(output_dir)
    
    # Dictionary to store results
    results = Dict()
    
    # Store original grayscale image
    results["original"] = img
    
    # 1. Otsu's method
    try
        results["otsu"] = binarize(img, Otsu())
        save(joinpath(output_dir, "otsu.png"), results["otsu"])
    catch e
        @warn "Otsu's method failed: $e"
    end
    
    # 2. Niblack's method
    try
        results["niblack"] = binarize(img, Niblack(window_size=15, k=0.2))
        save(joinpath(output_dir, "niblack.png"), results["niblack"])
    catch e
        @warn "Niblack's method failed: $e"
    end
    
    # 3. Sauvola's method
    try
        results["sauvola"] = binarize(img, Sauvola(window_size=15, k=0.2, R=128))
        save(joinpath(output_dir, "sauvola.png"), results["sauvola"])
    catch e
        @warn "Sauvola's method failed: $e"
    end
    
    # 4. Bradley's method
    try
        results["bradley"] = binarize(img, Bradley(s=60, t=15))
        save(joinpath(output_dir, "bradley.png"), results["bradley"])
    catch e
        @warn "Bradley's method failed: $e"
    end
    
    # 5. Intermodes method
    try
        results["intermodes"] = binarize(img, Intermodes())
        save(joinpath(output_dir, "intermodes.png"), results["intermodes"])
    catch e
        @warn "Intermodes method failed: $e"
    end
    
    # 6. Manual threshold
    try
        results["manual"] = binarize(img, 0.5)  # Using 0.5 as example threshold
        save(joinpath(output_dir, "manual_threshold.png"), results["manual"])
    catch e
        @warn "Manual threshold failed: $e"
    end
    
    return results
end

"""
Display all results in a grid layout
"""
function display_results(results)
    # Calculate grid dimensions
    n = length(results)
    cols = floor(Int, sqrt(n))
    rows = ceil(Int, n/cols)
    
    println("\nResults saved in 'binarized_output' directory.")
    println("Methods applied:")
    for (method, _) in results
        println("- $method")
    end
end

"""
Main execution function
"""
function main()
    # Load test image
    println("Loading test image 'cameraman'...")
    img = testimage("cameraman")
    
    # Ensure image is grayscale
    img = ensure_grayscale(img)
    
    println("Applying binarization methods...")
    results = apply_binarization_methods(img)
    
    # Display results
    display_results(results)
    
    println("\nTo process your own image, use:")
    println("img = load(\"path/to/your/image.jpg\")")
    println("results = apply_binarization_methods(ensure_grayscale(img))")
end

# Example usage for custom image
function process_custom_image(image_path)
    if !isfile(image_path)
        error("Image file not found: $image_path")
    end
    
    img = load(image_path)
    img = ensure_grayscale(img)
    return apply_binarization_methods(img)
end

# Run the main function if this script is run directly
if abspath(PROGRAM_FILE) == @__FILE__
    main()
end