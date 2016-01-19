/**
 * Created by MrTrustworthy on 19.01.2016.
 */


var Shaders = {
    vertex_shaders: {},
    fragment_shaders: {}
};

Shaders.vertex_shaders.basic = `
uniform float time;

varying vec2 vUv;

void main() {
    vUv = uv;

    float c = sin(time/25.0);
    vec3 newPosition = position + normal * vec3(c);

    gl_Position =   projectionMatrix *
                    modelViewMatrix *
                    vec4(newPosition,1.0);
}
`;


Shaders.fragment_shaders.basic = `
uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main( void ) {

    float progress = time / 20.0;

    vec2 position = -1.0 + 2.0 * vUv;

    vec4 noise = texture2D( texture2, vUv );
    vec2 T1 = vUv + vec2( 1.5, -1.5 ) * progress  *0.02;
    vec2 T2 = vUv + vec2( -0.5, 2.0 ) * progress * 0.01;

    T1.x += noise.x * 2.0;
    T1.y += noise.y * 2.0;
    T2.x -= noise.y * 0.2;
    T2.y += noise.z * 0.2;

    float p = texture2D( texture2, T1 * 2.0 ).a;

    vec4 color = texture2D( texture1, T2 * 2.0 );
    vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

    if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
    if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }
    if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }

    gl_FragColor = temp;

}
`;


module.exports = Shaders;