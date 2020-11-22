package com.yu.model;

import java.time.Instant;

public class Family {

    private int id;

    private int version = 0;

    private Instant creationDate;

//    private People father;

//    private People mother;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

//    public People getFather() {
//        return father;
//    }
//
//    public void setFather(People father) {
//        this.father = father;
//    }
//
//    public People getMother() {
//        return mother;
//    }
//
//    public void setMother(People mother) {
//        this.mother = mother;
//    }

}
