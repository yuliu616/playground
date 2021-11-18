package com.yu.model.dto;

public class CountDto {

    public CountDto(){
    }

    public CountDto(long count){
        this.count = count;
    }

    private long count;

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}
