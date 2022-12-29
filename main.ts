//% weight=100 color=#0fbc11 icon="\uf0b2"
namespace TTS { 

    let I2C_ADDR = 0x40;  //i2c address
    let _unicode: number[] = [];
    let _len = 0;

    let START_SYNTHESIS = 0x01;

    function readACK(): number {
        basic.pause(20);
        let data: Buffer = pins.i2cReadBuffer(I2C_ADDR, 2)
        basic.pause(10);
        let data1 = data[0];
        let data2 = data[1];
        if (data1 == 0x4f || data2 == 0x4F)
            return 0x4f;
        else
            return data1;
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function wait(): void {
        basic.pause(20);
        while (readACK() != 0x4F) { }//等待语音播放完成
    }

    //% block="speech synthesis %word"
    //% weight=30
    export function speak(word : string) { 
        _len = word.length;
        let length = 0;
        let head = [0xfd, 0, 0, 0, 0];
        for (let i = 0; i < _len; i++) {
            _unicode.push(word.charCodeAt(i) & 0x7f);
        }
        // sendPack(START_SYNTHESIS1, _unicode, _len);
        length = 2 + _len;
        head[1] = length >> 8;
        head[2] = length & 0xff;
        head[3] = START_SYNTHESIS;
        head[4] = 0x03;
        pins.i2cWriteBuffer(I2C_ADDR, pins.createBufferFromArray(head), false);

        pins.i2cWriteBuffer(I2C_ADDR, pins.createBufferFromArray(_unicode), false);
        wait();

        _len = 0;
        _unicode = [];
    }
}





