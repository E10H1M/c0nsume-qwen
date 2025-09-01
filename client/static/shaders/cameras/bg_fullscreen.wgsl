struct VSOut {
  @builtin(position) pos : vec4<f32>,
  @location(0) uv : vec2<f32>,
};

@vertex
fn vs(@builtin(vertex_index) vi : u32) -> VSOut {
  var positions = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0),
  );
  var out : VSOut;
  let p = positions[vi];
  out.pos = vec4<f32>(p, 0.0, 1.0);
  out.uv  = vec2<f32>(p.x, -p.y) * 0.5 + vec2<f32>(0.5, 0.5); // <- flipped Y
  return out;
}

@group(0) @binding(1) var samp : sampler;
@group(0) @binding(2) var tex  : texture_2d<f32>;

@fragment
fn fs(in : VSOut) -> @location(0) vec4<f32> {
  return textureSample(tex, samp, in.uv);
}
