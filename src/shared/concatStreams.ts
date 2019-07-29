import {Duplex, PassThrough, Stream} from "stream";

/**
 * Merge multiple streams.
 *
 * @see https://stackoverflow.com/a/56887262/5384846
 * @param streams stream array to be merged
 */
export default function concatStreams(streams: readonly Stream[]) {
    let ends = streams.length;
    return streams.reduce((mergedStream: Duplex, stream) => {
        // prevent automated 'end' event handler from firing
        mergedStream = stream.pipe(mergedStream, {end: false});
        // increase end-counter
        stream.once("end", () => {
            ends--;
            if (ends === 0) {
                mergedStream.emit("end");
            }
        });
        return mergedStream;
    }, new PassThrough());
}
