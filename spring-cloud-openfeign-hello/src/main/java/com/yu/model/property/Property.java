package com.yu.model.property;

import com.yu.model.IHasId;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class Property implements IHasId {

    private String id;

    private long version;

    private Instant creationDate;

    private Instant lastUpdated;

    @NotBlank
    private String name;

    private boolean isActive;

    @NotBlank
    private String ownerId;

    private LocalDate ownershipDate;

    /**
     * address geo-location, in latitude.
     */
    private BigDecimal geoAddrLatitude;

    /**
     * address geo-location, in longitude.
     */
    private BigDecimal geoAddrLongitude;

    /**
     * text-based address, floor line.
     * examples:
     * - Room 1604, 16/f
     * - 16层 1604房
     */
    private String addrFloorLine;

    /**
     * text-based address, block number within building/estate.
     * examples:
     * - 3
     * - Block 3
     * - 三栋
     */
    private String addrBlock;

    /**
     * text-based address, street address (could be multiple lines).
     * examples:
     *   观澜社区
     *   下沙经济技术开发区24号大街
     *   金隅·观澜时代天筑
     */
    private String addrStreetAddress;

    /**
     * text-based address, district (街道).
     * examples:
     * - 和平街街道
     */
    private String addrDistrict;

    /**
     * text-based address, area/county name name（区）.
     * examples:
     * - 朝阳区
     */
    private String addrArea;

    /**
     * postal code of the address.
     * examples:
     * - 100029
     */
    private String addrPostalCode;

    /**
     * city(城市) of the address.
     * examples:
     * - Beijing
     * - 北京
     */
    @NotBlank
    private String addrCity;

    /**
     * province(省份) of the address.
     * examples:
     * - 湖南
     */
    private String addrProvince;

    /**
     * state(州) of the address (not applicable in China).
     * examples:
     * - California
     */
    private String addrState;

    /**
     * for the address, country of it.
     * format: lower-case, iso-3166-1 alpha-2 country code
     * (cn=China, fr=France, us=United State)
     * > https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     */
    @NotBlank
    private String addrCountryCode;

    public Property() {}

    public Property(String id) {
        this.id = id;
    }

    @Override
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDate getOwnershipDate() {
        return ownershipDate;
    }

    public void setOwnershipDate(LocalDate ownershipDate) {
        this.ownershipDate = ownershipDate;
    }

    public BigDecimal getGeoAddrLatitude() {
        return geoAddrLatitude;
    }

    public void setGeoAddrLatitude(BigDecimal geoAddrLatitude) {
        this.geoAddrLatitude = geoAddrLatitude;
    }

    public BigDecimal getGeoAddrLongitude() {
        return geoAddrLongitude;
    }

    public void setGeoAddrLongitude(BigDecimal geoAddrLongitude) {
        this.geoAddrLongitude = geoAddrLongitude;
    }

    public String getAddrFloorLine() {
        return addrFloorLine;
    }

    public void setAddrFloorLine(String addrFloorLine) {
        this.addrFloorLine = addrFloorLine;
    }

    public String getAddrBlock() {
        return addrBlock;
    }

    public void setAddrBlock(String addrBlock) {
        this.addrBlock = addrBlock;
    }

    public String getAddrStreetAddress() {
        return addrStreetAddress;
    }

    public void setAddrStreetAddress(String addrStreetAddress) {
        this.addrStreetAddress = addrStreetAddress;
    }

    public String getAddrDistrict() {
        return addrDistrict;
    }

    public void setAddrDistrict(String addrDistrict) {
        this.addrDistrict = addrDistrict;
    }

    public String getAddrArea() {
        return addrArea;
    }

    public void setAddrArea(String addrArea) {
        this.addrArea = addrArea;
    }

    public String getAddrPostalCode() {
        return addrPostalCode;
    }

    public void setAddrPostalCode(String addrPostalCode) {
        this.addrPostalCode = addrPostalCode;
    }

    public String getAddrCity() {
        return addrCity;
    }

    public void setAddrCity(String addrCity) {
        this.addrCity = addrCity;
    }

    public String getAddrProvince() {
        return addrProvince;
    }

    public void setAddrProvince(String addrProvince) {
        this.addrProvince = addrProvince;
    }

    public String getAddrState() {
        return addrState;
    }

    public void setAddrState(String addrState) {
        this.addrState = addrState;
    }

    public String getAddrCountryCode() {
        return addrCountryCode;
    }

    public void setAddrCountryCode(String addrCountryCode) {
        this.addrCountryCode = addrCountryCode;
    }
}
