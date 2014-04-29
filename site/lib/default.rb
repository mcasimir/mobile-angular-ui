# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

module MyLib 
  def release_version
    "1.0"
  end
end 

include MyLib 
