export const defaultVertexShader = `attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
uniform float u_flipY;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}`;

export const twglDefaultFs = `
precision mediump float;

varying vec2 texcoord;
uniform sampler2D texture;

void main() {
  if (texcoord.x < 0.0 || texcoord.x > 1.0 ||
      texcoord.y < 0.0 || texcoord.y > 1.0) {
    discard;
  }
  gl_FragColor = texture2D(texture, texcoord);
}`

export const twglDarkenFs = `
precision mediump float;

varying vec2 texcoord;
uniform sampler2D texture;

void main() {
vec4 color = texture2D(texture, texcoord);
float avgColor = ((color.r+color.g+color.b)/3.0)*0.8;

gl_FragColor = vec4(avgColor, avgColor, avgColor,1.0);
}`


export const twglPixelateFs = `
precision mediump float;

varying vec2 texcoord;
uniform sampler2D texture;

void main() {
  float pixelWidth = 0.02;
  float pixelHeight = 0.02;

  float x = floor(texcoord.x/pixelWidth)*pixelWidth;
  float y = floor(texcoord.y/pixelHeight)*pixelHeight;

  gl_FragColor = texture2D(texture, vec2(x, y));

}`

export const twglDefaultVS = `
// we will always pass a 0 to 1 unit quad
// and then use matrices to manipulate it
attribute vec4 position;

uniform mat4 matrix;
uniform mat4 textureMatrix;

varying vec2 texcoord;

void main () {
  gl_Position = matrix * position;

  texcoord = (textureMatrix * position).xy;
}`

export const defaultFragmentShader = `precision mediump float;

// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;


void main() {

gl_FragColor = texture2D(u_image, v_texCoord);
}`

export const pixelateFrag = `
    precision mediump float;

		// our texture
		uniform sampler2D u_image;
		uniform vec2 u_textureSize;

		// the texCoords passed in from the vertex shader.
    varying vec2 v_texCoord;


		void main() {

    float pixelWidth = 5.0/u_textureSize.x;
    float pixelHeight = 5.0/u_textureSize.y;

    float x = floor(v_texCoord.x/pixelWidth)*pixelWidth;
    float y = floor(v_texCoord.y/pixelHeight)*pixelHeight;

    gl_FragColor = texture2D(u_image, vec2(x, y));
		}`

export const equalizeFrag = `
precision mediump float;

// our texture
uniform sampler2D u_image;
uniform vec2 u_textureSize;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;


void main() {


vec4 color = texture2D(u_image, v_texCoord);
float avgColor = ((color.r+color.g+color.b)/3.0)*0.8;

gl_FragColor = vec4(avgColor, avgColor, avgColor,1.0);
}`