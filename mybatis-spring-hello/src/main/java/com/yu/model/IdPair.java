package com.yu.model;

public class IdPair {

    private long id;

    private long left;

    private long right;

    public IdPair() {
    }

    public IdPair(long left, long right) {
        this.left = left;
        this.right = right;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getLeft() {
        return left;
    }

    public void setLeft(long left) {
        this.left = left;
    }

    public long getRight() {
        return right;
    }

    public void setRight(long right) {
        this.right = right;
    }

}
