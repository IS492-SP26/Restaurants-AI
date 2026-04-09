package com.restaurant.marketing.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StructuredAnalysis {

    private String executiveSummary;
    private String recommendedDistrict;
    private String suggestedConceptType;
    private String primaryTargetDemographic;
    private String secondaryTargetDemographic;
    private CompetitorLandscape competitorLandscape;
    private BrandPositioning brandPositioning;
    private LaborMarket laborMarket;
    private SeasonalityProfile seasonality;
    private OrchestratorSignals orchestratorSignals;

    public String getExecutiveSummary()                          { return executiveSummary; }
    public void   setExecutiveSummary(String v)                  { this.executiveSummary = v; }
    public String getRecommendedDistrict()                       { return recommendedDistrict; }
    public void   setRecommendedDistrict(String v)               { this.recommendedDistrict = v; }
    public String getSuggestedConceptType()                      { return suggestedConceptType; }
    public void   setSuggestedConceptType(String v)              { this.suggestedConceptType = v; }
    public String getPrimaryTargetDemographic()                  { return primaryTargetDemographic; }
    public void   setPrimaryTargetDemographic(String v)          { this.primaryTargetDemographic = v; }
    public String getSecondaryTargetDemographic()                { return secondaryTargetDemographic; }
    public void   setSecondaryTargetDemographic(String v)        { this.secondaryTargetDemographic = v; }
    public CompetitorLandscape getCompetitorLandscape()          { return competitorLandscape; }
    public void   setCompetitorLandscape(CompetitorLandscape v)  { this.competitorLandscape = v; }
    public BrandPositioning getBrandPositioning()                { return brandPositioning; }
    public void   setBrandPositioning(BrandPositioning v)        { this.brandPositioning = v; }
    public LaborMarket getLaborMarket()                          { return laborMarket; }
    public void   setLaborMarket(LaborMarket v)                  { this.laborMarket = v; }
    public SeasonalityProfile getSeasonality()                   { return seasonality; }
    public void   setSeasonality(SeasonalityProfile v)           { this.seasonality = v; }
    public OrchestratorSignals getOrchestratorSignals()          { return orchestratorSignals; }
    public void   setOrchestratorSignals(OrchestratorSignals v)  { this.orchestratorSignals = v; }

    // -------------------------------------------------------------------------

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CompetitorLandscape {
        private String competitionLevel;
        private int estimatedDirectCompetitors;
        private List<String> namedCompetitors;
        private List<String> marketGaps;
        private String summary;

        public String getCompetitionLevel()                  { return competitionLevel; }
        public void   setCompetitionLevel(String v)          { this.competitionLevel = v; }
        public int    getEstimatedDirectCompetitors()        { return estimatedDirectCompetitors; }
        public void   setEstimatedDirectCompetitors(int v)   { this.estimatedDirectCompetitors = v; }
        public List<String> getNamedCompetitors()            { return namedCompetitors; }
        public void   setNamedCompetitors(List<String> v)    { this.namedCompetitors = v; }
        public List<String> getMarketGaps()                  { return marketGaps; }
        public void   setMarketGaps(List<String> v)          { this.marketGaps = v; }
        public String getSummary()                           { return summary; }
        public void   setSummary(String v)                   { this.summary = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BrandPositioning {
        private String positioningStatement;
        private String priceTier;
        private double recommendedAvgCheckUsd;
        private List<String> differentiators;
        private List<String> recommendedChannels;

        public String getPositioningStatement()              { return positioningStatement; }
        public void   setPositioningStatement(String v)      { this.positioningStatement = v; }
        public String getPriceTier()                         { return priceTier; }
        public void   setPriceTier(String v)                 { this.priceTier = v; }
        public double getRecommendedAvgCheckUsd()            { return recommendedAvgCheckUsd; }
        public void   setRecommendedAvgCheckUsd(double v)    { this.recommendedAvgCheckUsd = v; }
        public List<String> getDifferentiators()             { return differentiators; }
        public void   setDifferentiators(List<String> v)     { this.differentiators = v; }
        public List<String> getRecommendedChannels()         { return recommendedChannels; }
        public void   setRecommendedChannels(List<String> v) { this.recommendedChannels = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LaborMarket {
        private String availability;
        private double estimatedFohWageUsd;
        private double estimatedBohWageUsd;
        private String bestHiringWindow;
        private List<String> challenges;

        public String getAvailability()                  { return availability; }
        public void   setAvailability(String v)          { this.availability = v; }
        public double getEstimatedFohWageUsd()           { return estimatedFohWageUsd; }
        public void   setEstimatedFohWageUsd(double v)   { this.estimatedFohWageUsd = v; }
        public double getEstimatedBohWageUsd()           { return estimatedBohWageUsd; }
        public void   setEstimatedBohWageUsd(double v)   { this.estimatedBohWageUsd = v; }
        public String getBestHiringWindow()              { return bestHiringWindow; }
        public void   setBestHiringWindow(String v)      { this.bestHiringWindow = v; }
        public List<String> getChallenges()              { return challenges; }
        public void   setChallenges(List<String> v)      { this.challenges = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SeasonalityProfile {
        private boolean studentDependencyHigh;
        private double summerRevenueDropEstimate;
        private List<String> peakMonths;
        private List<String> lowMonths;
        private List<String> revenueSpikingEvents;
        private String summary;

        public boolean isStudentDependencyHigh()                 { return studentDependencyHigh; }
        public void    setStudentDependencyHigh(boolean v)       { this.studentDependencyHigh = v; }
        public double  getSummerRevenueDropEstimate()            { return summerRevenueDropEstimate; }
        public void    setSummerRevenueDropEstimate(double v)    { this.summerRevenueDropEstimate = v; }
        public List<String> getPeakMonths()                      { return peakMonths; }
        public void    setPeakMonths(List<String> v)             { this.peakMonths = v; }
        public List<String> getLowMonths()                       { return lowMonths; }
        public void    setLowMonths(List<String> v)              { this.lowMonths = v; }
        public List<String> getRevenueSpikingEvents()            { return revenueSpikingEvents; }
        public void    setRevenueSpikingEvents(List<String> v)   { this.revenueSpikingEvents = v; }
        public String  getSummary()                              { return summary; }
        public void    setSummary(String v)                      { this.summary = v; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OrchestratorSignals {
        private boolean modelSummerRevenueDip;
        private boolean highStaffTurnoverExpected;
        private boolean highCompetitionMarket;
        private int recommendedMinSeats;
        private int recommendedMaxSeats;
        private boolean liquorLicenseRecommended;
        private String analysisConfidence;

        public boolean isModelSummerRevenueDip()                 { return modelSummerRevenueDip; }
        public void    setModelSummerRevenueDip(boolean v)       { this.modelSummerRevenueDip = v; }
        public boolean isHighStaffTurnoverExpected()             { return highStaffTurnoverExpected; }
        public void    setHighStaffTurnoverExpected(boolean v)   { this.highStaffTurnoverExpected = v; }
        public boolean isHighCompetitionMarket()                 { return highCompetitionMarket; }
        public void    setHighCompetitionMarket(boolean v)       { this.highCompetitionMarket = v; }
        public int     getRecommendedMinSeats()                  { return recommendedMinSeats; }
        public void    setRecommendedMinSeats(int v)             { this.recommendedMinSeats = v; }
        public int     getRecommendedMaxSeats()                  { return recommendedMaxSeats; }
        public void    setRecommendedMaxSeats(int v)             { this.recommendedMaxSeats = v; }
        public boolean isLiquorLicenseRecommended()              { return liquorLicenseRecommended; }
        public void    setLiquorLicenseRecommended(boolean v)    { this.liquorLicenseRecommended = v; }
        public String  getAnalysisConfidence()                   { return analysisConfidence; }
        public void    setAnalysisConfidence(String v)           { this.analysisConfidence = v; }
    }
}
