class Webaudio {
    static scriptBufferSize = 512;

    constructor(params) {
        this.buffer = null;
        this.audioContext = this.getAudioContext();
        this.offlineAudioContext = null;
        this.scriptNode = null; //AudioScriptProcessor
        this.source = null ; //AudioBufferSourceNode
    }

    init() {
        this.createScriptNode();
    }

    getAudioContext() {
        return new (window.AudioContext || window.webkitAudioContext)();
    }


    getOfflineAudioContext(sampleRate) {
        return new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, sampleRate);
    }

    //after httpfetched codes
    decodeArrayBuffer(arrayBuffer, cb, errorCb) {
        if (!this.offlineAudioContext) {
            this.offlineAudioContext = this.getOfflineAudioContext(this.audioContext && this.audioContext.sampleRate ? this.audioContext.sampleRate : 44100);
        }
        this.offlineAudioContext.decodeAudioData(arrayBuffer, data => {
            cb(data);
        }, errorCb);
    }

    loadDecodedArrayBuffer(data){
        this.source = this.audioContext.createBufferSource();
        this.buffer = data;
        this.source.buffer = this.buffer;
        this.source.start(0)
    }

    createScriptNode() {
        if (this.audioContext.createScriptProcessor) {
            this.scriptNode = this.audioContext.createScriptProcessor(Webaudio.scriptBufferSize);
        }
        this.scriptNode.connect(this.audioContext.destination);
    }

}

export default Webaudio
// generael flow of web audio processing
// 1. arraybuffer via http -> ArrayBuffer
// 2. audiocontext.decodeAudioDatat() -> AudioBuffer
// 3. pass audioBuffer to AudioBufferSourceNode via audioContext
// 4. then start() via source:AudioBufferSourceNode

//TODO: get the understanding of general play, pause and stop state
//TODO: get the understanding of drawing
/** caller class
 * [util]fetch -> [util]arraybuffer ->
 * [webaudio]ac.decodeArraybuffer() {[html]]decodeAudioData} ->
 * [webuaudio] setBuffer {this.buffer = buffer} && [webaudio]setofflineaudiocontext (){ new OfflineAudioContext(xx,xx,xx) } ->
 * [webaudio] createSource() { this.source = ac.createBufferSource(); this.source.buffer = this.buffer; this.source.connect(this.analyser); //maybe doens't need to connect to analyser;
 * //more about bufferSource property and stuffs} ->
 *
 * **/
/**
 * [ws] load() -> [ws]loadBuffer() -> [ws] getArrayBuffer() http -> arrayBuffer length  -> [ws] loadArrayBuffer() { -> [wa] decodeArrayBuffer... done? then [ws]loadDecodedBuffer..-> [wa] load() -> createBufferSource() via offlinecontext}
 */
